// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// กำหนดตัวเลือกสำหรับ swagger-jsdoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for SASI POS App',
    },
  },
  apis: ['./routes/*.js','index.js'], // กำหนด path ของไฟล์ที่มีการคอมเมนต์ swagger
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
