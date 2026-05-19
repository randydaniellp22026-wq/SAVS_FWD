/**
 * Vision Service — IA de análisis de imágenes de vehículos
 *
 * Usa la API de OpenAI-compatible de Groq con un modelo multimodal
 * (llama-3.2-90b-vision-preview) para extraer datos estructurados
 * de una foto de vehículo y devolverlos en formato listo para guardar en el modelo Auto.
 */

const axios = require('axios');

// Prompt del sistema: lo que la IA "sabe" antes de ver la imagen
const SYSTEM_PROMPT = `
Eres un experto tasador y catalogador de vehiculos importados.
Tu unica funcion es analizar una fotografia de un vehiculo y devolver
UNICAMENTE un objeto JSON con los campos del modelo de base de datos.

Reglas estrictas:
- Devuelve SIEMPRE un objeto JSON valido, sin texto antes ni despues.
- Usa null en cualquier campo que no puedas determinar desde la imagen.
- No inventes datos si no los ves en la imagen.
- Los campos de moneda usan el simbolo ₡ (colones costarricenses).
- El campo "year" y "anio" deben ser lo mismo (numero entero).

Estructura JSON esperada:
{
  "name":        "Nombre completo del modelo (ej. Kia Sportage 2023)",
  "marca":       "Marca (ej. Kia, Toyota, Hyundai)",
  "modelo":      "Modelo especifico (ej. Sportage, Rav4, Tucson)",
  "motor":       "Descripcion del motor si es visible",
  "engine_size": "Cilindrada si se ve en el vehiculo",
  "doors":       "Numero de puertas (ej. 4 o 2)",
  "drive":       "Traccion (ej. FWD, AWD, 4x4)",
  "passengers":  "Numero de asientos",
  "steering":    "Volante (ej. Hidraulica, Electrica)",
  "type":        "Tipo de carroceria (SUV, Sedan, Hatchback, Pickup, Coupe, Convertible)",
  "year":        <anio como numero>,
  "anio":        <mismo anio>,
  "mileage":     "Kilometraje visible o '0 km' si es nuevo",
  "price":       <precio en numero decimal, null si no se ve>,
  "precio":      <mismo precio>,
  "stock":       1,
  "tag":         "Disponible",
  "tagColor":    "#eab308",
  "transmission":"Manual o Automatica",
  "fuel":        "Gasolina, Diesel, Hibrido o Electrico",
  "color":       "Color exterior del vehiculo",
  "summary":     "Descripcion comercial breve del vehiculo, maximo 3 oraciones.",
  "heroSubtitle":"Subtitulo corto para el detalle del producto.",
  "performanceData": "Datos de rendimiento si son visibles en la imagen",
  "specDescriptions": {},
  "features":    ["Caracteristica 1", "Caracteristica 2"]
}

IMPORTANTE: Devuelve solo el JSON. Sin explicaciones, sin markdown, sin bloques de codigo.
`;

/**
 * Analiza una imagen de vehiculo y devuelve los datos estructurados.
 * @param {string} base64Data  — Imagen codificada en base64 (sin prefijo data:image/…)
 * @param {string} mimeType    — Tipo MIME de la imagen (image/jpeg, image/png, …)
 * @returns {Promise<object>}  — Objeto con los campos del vehiculo
 */
async function analyzeVehicleImage(base64Data, mimeType) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY no configurada en el entorno.');
    }

    const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: 'llama-3.2-90b-vision-preview',
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Data}`
                            }
                        },
                        {
                            type: 'text',
                            text: 'Analiza esta imagen de vehiculo y devuelve el JSON con todos los datos estructurados.'
                        }
                    ]
                }
            ],
            temperature: 0.2,
            max_tokens: 1024
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        }
    );

    const content = response.data.choices[0].message.content.trim();

    // Extraer el JSON de la respuesta (por si la IA agrega texto antes/despues)
    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch {
        const firstBrace = content.indexOf('{');
        const lastBrace  = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            parsed = JSON.parse(content.slice(firstBrace, lastBrace + 1));
        } else {
            throw new Error('La IA no devolvio un JSON valido. Respuesta: ' + content.slice(0, 200));
        }
    }

    // Normalizar campos numericos
    if (parsed.year    != null) parsed.year    = parseInt(parsed.year,    10);
    if (parsed.anio    != null) parsed.anio    = parseInt(parsed.anio,    10);
    if (parsed.price   != null) parsed.price   = parseFloat(parsed.price);
    if (parsed.precio  != null) parsed.precio  = parseFloat(parsed.precio);
    if (parsed.stock   == null) parsed.stock   = 1;

    return parsed;
}

// Prompt para generación de banners de publicidad/marketing
const BANNER_PROMPT = `
Eres un copywriter experto en marketing automotriz de IMPORTADORA SAVS, Costa Rica.
Tu tarea es analizar la fotografia de un vehiculo que te proporciona el usuario y generar un titulo comercial sumamente atractivo y una descripcion promocional persuasiva para un banner publicitario del sitio web.

Reglas:
- El titulo debe ser corto y llamativo (maximo 40 caracteres), por ejemplo: "¡Llegó el nuevo Hyundai Tucson 2022!" o "¡Oferta Especial de la Semana!".
- La descripcion debe ser persuasiva e incentivar la compra o cotizacion (maximo 120 caracteres), mencionando caracteristicas visibles clave del carro (color, estilo, estado reluciente).
- Devuelve la respuesta UNICAMENTE como un objeto JSON con los campos "titulo" y "descripcion".
- No agregues explicaciones, bloques de código ni markdown. Devuelve solo el JSON valido.

Estructura JSON esperada:
{
  "titulo": "Titulo atractivo aqui",
  "descripcion": "Descripcion persuasiva aqui"
}
`;

/**
 * Analiza una imagen de banner y genera copys publicitarios con IA.
 * @param {string} base64Data
 * @param {string} mimeType
 */
async function generateBannerCopy(base64Data, mimeType) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY no configurada en el entorno.');
    }

    const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: 'llama-3.2-90b-vision-preview',
            messages: [
                {
                    role: 'system',
                    content: BANNER_PROMPT
                },
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Data}`
                            }
                        },
                        {
                            type: 'text',
                            text: 'Analiza esta imagen y genera el titulo y descripcion promocional para el anuncio en formato JSON.'
                        }
                    ]
                }
            ],
            temperature: 0.7,
            max_tokens: 256
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        }
    );

    const content = response.data.choices[0].message.content.trim();

    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch {
        const firstBrace = content.indexOf('{');
        const lastBrace  = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            parsed = JSON.parse(content.slice(firstBrace, lastBrace + 1));
        } else {
            throw new Error('La IA no devolvió un JSON válido para el banner.');
        }
    }

    return {
        titulo: parsed.titulo || 'Sin título',
        descripcion: parsed.descripcion || ''
    };
}

module.exports = { analyzeVehicleImage, generateBannerCopy };
