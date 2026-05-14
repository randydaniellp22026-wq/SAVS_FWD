const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar modelos (index.js de Sequelize CLI carga todo automáticamente)
const { sequelize } = require('./models');

const app = express();

// ─────────────────────────────────────────────
// Middlewares Globales
// ─────────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 
app.use(cookieParser());

// ─────────────────────────────────────────────
// Router versionado v1
// ─────────────────────────────────────────────
const v1Router = express.Router();

v1Router.use('/users', require('./routes/users'));
v1Router.use('/vehicles', require('./routes/vehicles'));
v1Router.use('/reviews', require('./routes/reviews'));
v1Router.use('/requests', require('./routes/requests'));
v1Router.use('/sale_requests', require('./routes/saleRequests'));
v1Router.use('/branches', require('./routes/branches'));
v1Router.use('/technical_glossary', require('./routes/technicalGlossary'));
v1Router.use('/settings', require('./routes/settings'));
v1Router.use('/auth', require('./routes/auth'));
v1Router.use('/chatbot', require('./routes/chatbot'));

// Montar el router versionado en /api/v1
app.use('/api/v1', v1Router);

// Retrocompatibilidad: /api/* sigue funcionando exactamente igual
app.use('/api', v1Router);

// Aliases para cumplir con los requisitos de pruebas de integración
app.post('/api/login', require('./controllers/authController').login);
app.post('/api/autos', require('./middlewares/authMiddleware').verificarToken, require('./controllers/vehicleController').create);

// ─────────────────────────────────────────────
// Base de Datos
// ─────────────────────────────────────────────
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a la base de datos establecida con éxito (Sequelize CLI).');
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err);
    });

// Ruta raíz — Health Check
app.get('/', (req, res) => {
    res.json({ 
        message: '🚗 API del Sistema de Venta de Autos en línea',
        version: 'v1',
        documentation: '/api/v1'
    });
});

// ─────────────────────────────────────────────
// Arrancar servidor (solo si se ejecuta directamente)
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
}

module.exports = app;
