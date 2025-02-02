// swagger-docs.js file for the details of auto-generating API documentation in the Node project
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: '3.1.6',
        title: 'AdhereLive API Documentation',
        description: 'This is the API documentation for the React & Node server AdhereLive application',
    },
    host: process.env.API_URL || 'localhost:3000', // Will be replaced by actual host in production
    basePath: '/',
    schemes: ['https', 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        // You can group your APIs by folders
        {
            name: 'Patients',
            description: 'Patient related endpoints'
        },
        {
            name: 'Auth',
            description: 'Authentication endpoints'
        },
        {
            name: 'Admin',
            description: 'Administration related endpoints'
        },
        {
            name: 'Common',
            description: 'Common for the application endpoints'
        },
        {
            name: 'Doctors',
            description: 'Patient related endpoints'
        },
        {
            name: 'Provider',
            description: 'Provider related endpoints'
        }
        // Add more tags based on your route folders
    ],
    securityDefinitions: {
        bearerAuth: {
            type: 'https',
            name: 'Authorization',
            in: 'header',
        },
    },
    definitions: {
        // You can define common models here
        Patient: {
            $name: 'John Doe',
            $age: 30,
            medical_history: []
        }
        // Add more model definitions as needed
    }
};

// Define output file and endpoints files
const outputFile = './adherelive-api-swagger.json';
const endpointsFiles = [
    '../server/app.js'     // Your main application file
    // './routes/**/*.js', // This will include all JS files in routes and its subfolders
];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
// End of swagger-docs.js file