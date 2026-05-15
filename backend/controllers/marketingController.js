const { Resend } = require('resend');
const { Usuario } = require('../models');

// Inicializar Resend (usaremos la API Key del .env)
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envía un correo masivo a todos los usuarios registrados
 */
exports.broadcastEmail = async (req, res) => {
    try {
        const { subject, content, isHtml = true, testEmail = null } = req.body;

        if (!subject || !content) {
            return res.status(400).json({ error: 'Asunto y contenido son requeridos' });
        }

        let emailList = [];

        if (testEmail) {
            // Modo de prueba: solo al correo especificado
            emailList = [testEmail];
        } else {
            // Modo real: todos los usuarios
            const usuarios = await Usuario.findAll({
                attributes: ['email'],
            });
            emailList = usuarios.map(u => u.email).filter(email => email);
        }

        if (emailList.length === 0) {
            return res.status(404).json({ error: 'No hay destinatarios válidos' });
        }

        // 2. Enviar el correo usando Resend
        const data = await resend.emails.send({
            from: 'SAVS Importadora <onboarding@resend.dev>',
            to: emailList,
            subject: subject,
            html: isHtml ? content : undefined,
            text: !isHtml ? content : undefined,
        });

        res.json({ 
            success: true, 
            message: `Correo enviado exitosamente a ${emailList.length} usuarios`,
            details: data 
        });

    } catch (error) {
        console.error('Error en Broadcast:', error);
        res.status(500).json({ error: 'Error al procesar el envío masivo' });
    }
};
