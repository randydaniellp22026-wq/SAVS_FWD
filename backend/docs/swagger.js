const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Destiny Vault API',
      version: '1.0.0',
      description: 'Documentación de la API REST de The Destiny Vault (Importadora SAVS)',
    },
    servers: [{ url: '/api/v1', description: 'Servidor Principal (v1)' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/v1/*.js', './routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
