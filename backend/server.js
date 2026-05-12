const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();

// Base de Datos
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexión a la base de datos establecida con éxito (Sequelize CLI).');
    })
    .catch(err => {
        console.error('❌ Error al conectar con la base de datos:', err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
