const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Importar modelos (index.js de Sequelize CLI carga todo automáticamente)
const { sequelize } = require('./models');

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 
app.use(cookieParser());

// Rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/sale_requests', require('./routes/saleRequests'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/technical_glossary', require('./routes/technicalGlossary'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/auth', require('./routes/auth'));
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
