const { Usuario, Rol } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_provisional';

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    try {
        const { id, nombre, email, password, rolId, telefono, ubicacion, direccion_precisa, correo } = req.body;

        // Verificar si el usuario ya existe (por ID o por email)
        const usuarioExistente = await Usuario.findOne({ where: { email: email || correo } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado.' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario
        const nuevoUsuario = await Usuario.create({
            id: id || crypto.randomUUID(), // Generar UUID si no viene
            nombre,
            email: email || correo,
            correo: email || correo,
            password: hashedPassword,
            rolId: rolId || 2, // Por defecto rol 2 (asumiendo que 2 es cliente y 1 es admin)
            telefono,
            ubicacion,
            direccion_precisa,
            favorites: []
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', usuarioId: nuevoUsuario.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, correo, password } = req.body;
        const targetEmail = email || correo;

        // Buscar el usuario
        const usuario = await Usuario.findOne({ 
            where: { email: targetEmail },
            include: [{ model: Rol, as: 'rol' }]
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Credenciales inválidas.' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol ? usuario.rol.nombre : 'user' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar token en cookie segura
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'Lax', // O 'None' si es cross-site con HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        res.json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol ? usuario.rol.nombre : 'user'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
};

// Obtener datos del usuario actual
exports.getMe = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Rol, as: 'rol' }]
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verificar si un email existe (para recuperación)
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ 
            where: { email: email.toLowerCase().trim() },
            attributes: ['id', 'nombre', 'email']
        });

        if (!usuario) {
            return res.status(404).json({ error: 'No encontramos ninguna cuenta vinculada a este correo.' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Restablecer contraseña sin token (usando el flujo de código verificado en frontend)
exports.resetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Usuario.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
