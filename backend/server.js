const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar modelos (index.js de Sequelize CLI carga todo automáticamente)
const { sequelize } = require('./models');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');

const app = express();

// --- SEGURIDAD AVANZADA ---
// 1. Helmet: Configura cabeceras HTTP seguras (protege contra XSS, clickjacking, etc.)
app.use(helmet());

// 2. Rate Limiting: Limita peticiones para evitar ataques de fuerza bruta o DoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 peticiones por IP
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.'
});
app.use('/api/', limiter);

// Limitador más estricto para Login y Registro (Fuerza Bruta)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // Máximo 10 intentos por hora
    message: 'Demasiados intentos de acceso, su IP ha sido bloqueada temporalmente por seguridad.'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 3. XSS Clean: Sanitiza los datos de entrada para evitar inyección de scripts
// app.use(xss());

// 4. HPP: Previene ataques de polución de parámetros HTTP
// app.use(hpp());

// Middlewares estándar
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Reducido el límite de JSON por seguridad (evita ataques de carga)
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 
app.use(cookieParser());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/sale_requests', require('./routes/saleRequests'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/technical_glossary', require('./routes/technicalGlossary'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Base de Datos
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a la base de datos establecida con éxito (Sequelize CLI).');
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err);
    });

app.get('/', (req, res) => {
    res.json({ message: '🚗 API del Sistema de Venta de Autos en línea' });
});

// --- MANEJO DE ERRORES CENTRALIZADO ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        success: false,
        error: message,
        // Solo mostrar stack trace en desarrollo
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
