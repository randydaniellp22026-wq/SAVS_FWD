/**
 * Controlador del Chatbot IA
 * Administra la comunicacion entre el usuario y la API de inteligencia artificial (Groq)
 * incluyendo el contexto del inventario actual y soporte de analisis de imagenes.
 */
const axios = require('axios');
const fs = require('fs');
const { Auto, Setting } = require('../models');
const { analyzeVehicleImage } = require('../services/visionService');

function buildSystemPrompt(inventoryContext, whatsappNumber) {
    return (
`Eres SAVS AI Assistant de IMPORTADORA SAVS (Costa Rica). Responde en español, breve y profesional.
Solo temas: autos, inventario, financiamiento e importación. Usa Markdown simple (tablas si comparas).
Inventario real (no inventes precios):
${inventoryContext}
Reglas: si el auto está en inventario → nombre, año, precio + [CATALOGO] [WHATSAPP].
Si no está → ofrece importación desde Corea/EE.UU. + [WHATSAPP].
Pide catálogo o asesor humano → [CATALOGO] y/o [WHATSAPP]. Foto de vehículo → describe y [WHATSAPP].
WhatsApp: ${whatsappNumber}`
    );
}

/**
 * Llama a Groq con un modelo de solo texto (solo message, sin imagen).
 */
async function callTextModel(systemPrompt, userMessage, apiKey) {
    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.3,
            max_tokens: 400
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.choices[0].message.content.trim();
}

/**
 * Llama a Groq con un modelo de vision (message + image_url).
 */
async function callVisionModel(systemPrompt, userText, base64Data, mimeType, apiKey) {
    const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            model: "llama-3.2-90b-vision-preview",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: { url: `data:${mimeType};base64,${base64Data}` }
                        },
                        { type: "text", text: userText }
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
    return response.data.choices[0].message.content.trim();
}

exports.chat = async (req, res) => {
    try {
        // ── Aceptar tanto JSON como multipart ───────────────────────────────
        let message = '';
        let imageFile = null;

        if (req.file) {
            // Viene como multipart/form-data (con imagen)
            message = req.body.message || '';
            imageFile = req.file;
        } else {
            // Viene como application/json (solo texto, comportamiento anterior)
            message = req.body.message || '';
        }

        if (!message && !imageFile) {
            return res.status(400).json({ error: 'El mensaje o la imagen son requeridos' });
        }

        // ── Obtener contexto de la base de datos ─────────────────────────────
        const vehicles = await Auto.findAll();
        const settings = await Setting.findAll();

        const companySettings = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});

        const whatsappNumber = companySettings.company?.whatsapp || '+506 6476-9091';

        const inventoryContext = vehicles.length > 0
            ? vehicles.map(v => `- ${v.name} (${v.anio || v.year}) [${v.type || 'N/A'}] ID:${v.id} ₡${parseFloat(v.precio || v.price || 0).toLocaleString()}`).join('\n')
            : "Sin vehículos cargados.";

        const systemPrompt = buildSystemPrompt(inventoryContext, whatsappNumber);
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(503).json({
                error: 'GROQ_API_KEY no configurada. Agrégala en .env (raíz del proyecto) y reinicia el backend.'
            });
        }

        let reply;

        // ── Caso 1: Hay imagen → modelo de vision ───────────────────────────
        if (imageFile) {
            const base64Data = fs.readFileSync(imageFile.path, 'base64');
            const userText = message || 'Describe este vehiculo en detalle.';

            // Paso A: analizar imagen con el modelo de vision para extraer datos estructurados
            let detectedData;
            try {
                detectedData = await analyzeVehicleImage(base64Data, imageFile.mimetype);
            } catch (e) {
                console.warn('Vision analysis failed, continuing with generic prompt:', e.message);
            }

            // Paso B: enriquecer el prompt del usuario con los datos detectados
            let enrichedUserText = userText;
            if (detectedData) {
                const detectedBlock = [
                    detectedData.name        ? `Nombre detectado: ${detectedData.name}`                   : null,
                    detectedData.marca       ? `Marca detectada: ${detectedData.marca}`                    : null,
                    detectedData.modelo      ? `Modelo detectado: ${detectedData.modelo}`                   : null,
                    detectedData.type        ? `Tipo detectado: ${detectedData.type}`                       : null,
                    detectedData.year        ? `Anio detectado: ${detectedData.year}`                       : null,
                    detectedData.color       ? `Color detectado: ${detectedData.color}`                     : null,
                    detectedData.transmission? `Transmision detectada: ${detectedData.transmission}`         : null,
                    detectedData.fuel        ? `Combustible detectado: ${detectedData.fuel}`                 : null,
                    detectedData.mileage     ? `Kilometraje detectado: ${detectedData.mileage}`              : null,
                    detectedData.motor       ? `Motor detectado: ${detectedData.motor}`                      : null,
                ].filter(Boolean).join('\n');

                if (detectedBlock) {
                    enrichedUserText =
`El usuario envia una imagen y tambien un mensaje de texto.

IMPORTANTE: antes de responder, aqui tienes los datos que un modelo de vision
detecto automaticamente de la imagen (NO los inventes, usalos como referencia):
${detectedBlock}

Mensaje del usuario: ${userText}`;
                }
            }

            reply = await callVisionModel(systemPrompt, enrichedUserText, base64Data, imageFile.mimetype, apiKey);
            fs.unlink(imageFile.path, () => {}); // borrar archivo temporal
        }
        // ── Caso 2: Solo texto → modelo de texto ────────────────────────────
        else {
            reply = await callTextModel(systemPrompt, message, apiKey);
        }

        // ── Parsear etiquetas [WHATSAPP] y [CATALOGO] ───────────────────────
        let showWhatsapp = false;
        let showCatalog    = false;

        if (reply.includes('[WHATSAPP]') || reply.toLowerCase().includes('whatsapp') || reply.toLowerCase().includes('asesor')) {
            showWhatsapp = true;
            reply = reply.replace(/\[WHATSAPP\]/gi, '').trim();
        }

        if (
            reply.includes('[CATALOGO]') ||
            reply.toLowerCase().includes('catálogo') ||
            reply.toLowerCase().includes('catalogo') ||
            reply.toLowerCase().includes('inventario') ||
            reply.toLowerCase().includes('selección actual')
        ) {
            showCatalog = true;
            reply = reply.replace(/\[CATALOGO\]/gi, '').trim();
        }

        res.json({
            reply,
            whatsapp: whatsappNumber,
            showWhatsapp,
            showCatalog
        });

    } catch (error) {
        const groqErr = error.response?.data?.error;
        console.error('Error en Chatbot Controller:', groqErr || error.message);
        if (groqErr?.code === 'invalid_api_key') {
            return res.status(503).json({
                error: 'API key de Groq inválida. Revisa GROQ_API_KEY en .env (sin espacios) y reinicia el servidor.'
            });
        }
        res.status(500).json({ error: 'Error al procesar la respuesta de la IA' });
    }
};
