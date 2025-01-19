const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'AdhereLive API Documentation',
        description: 'This is the API documentation for the React & Node server AdhereLive application'
    },
    host: 'localhost:3000',
    schemes: ['http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['../server/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
