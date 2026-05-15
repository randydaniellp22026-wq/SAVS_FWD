/**
 * Controlador del Chatbot IA
 * Administra la comunicación entre el usuario y la API de inteligencia artificial (Groq LLaMA)
 * incluyendo el contexto del inventario actual en tiempo real.
 */
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
        1. Solo responde preguntas relacionadas con IMPORTADORA SAVS (venta de autos, inventario, importación desde Corea, financiamiento).
        2. PROHIBIDO hacer listas de autos. Si el usuario pregunta qué autos hay o pide el catálogo, responde con un breve mensaje general. Al final de tu respuesta, debes incluir EXACTAMENTE AMBAS etiquetas: [CATALOGO] y [WHATSAPP].
        3. Si preguntan por un auto específico y SÍ ESTÁ en el inventario, menciónalo brevemente e incluye ambas etiquetas: [CATALOGO] y [WHATSAPP].
        4. Si preguntan por un auto que NO ESTÁ, di que PODEMOS IMPORTARLO desde Corea o EE.UU e incluye la etiqueta [WHATSAPP].
        5. Si el usuario pide hablar con un humano o cierra la venta, incluye la etiqueta [WHATSAPP].
        
        INVENTARIO DISPONIBLE (Contexto interno para ti):
        ${inventoryContext}
        
        WhatsApp de la empresa: ${whatsappNumber}`;

        // 2. Llamar a Groq Cloud
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.3, // Reducido para mayor obediencia a las reglas
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let reply = response.data.choices[0].message.content;
        
        let showWhatsapp = false;
        let showCatalog = false;

        if (reply.includes('[WHATSAPP]') || reply.toLowerCase().includes('whatsapp') || reply.toLowerCase().includes('asesor')) {
            showWhatsapp = true;
            reply = reply.replace(/\[WHATSAPP\]/gi, '').trim();
        }
        
        // Fallback robusto para mostrar el botón azul
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
        console.error('Error en Chatbot Controller:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al procesar la respuesta de la IA' });
    }
};
