const axios = require('axios');
const { Auto, Setting } = require('../models');

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'El mensaje es requerido' });
        }

        // 1. Obtener contexto de la base de datos (Inventario y Configuración)
        const vehicles = await Auto.findAll();
        const settings = await Setting.findAll();
        
        const companySettings = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});

        const whatsappNumber = companySettings.company?.whatsapp || '+506 6476-9091';

        const inventoryContext = vehicles.length > 0 
            ? vehicles.map(v => `- ${v.name} (${v.anio}) [ID: ${v.id}]: ₡${parseFloat(v.precio).toLocaleString()}.`).join('\n')
            : "Consultar inventario en la web.";

        const systemPrompt = `Eres el asistente experto de IMPORTADORA SAVS, Costa Rica. 
        
        REGLAS CRÍTICAS:
        1. Solo responde preguntas relacionadas con IMPORTADORA SAVS (venta de autos, inventario, financiamiento, trámites, etc.).
        2. Si el usuario pregunta algo fuera de contexto (chistes, temas personales, política, etc.), declina amablemente indicando que eres un asistente especializado en la importadora.
        3. Si el usuario pregunta por un auto del inventario, DEBES dar el link usando este formato: [Ver detalles del auto](/inventory/details/ID).
        4. Si no sabes la respuesta, el usuario pide hablar con un humano, o se llega a una conclusión/acuerdo de interés, DEBES invitar al usuario a contactar por WhatsApp.
        5. Responde siempre de forma amable y profesional.
        
        INVENTARIO DISPONIBLE (Directo desde MySQL):
        ${inventoryContext}
        
        WhatsApp de la empresa: ${whatsappNumber}`;

        // 2. Llamar a Groq Cloud
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;

        res.json({
            reply,
            whatsapp: whatsappNumber
        });

    } catch (error) {
        console.error('Error en Chatbot Controller:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al procesar la respuesta de la IA' });
    }
};
