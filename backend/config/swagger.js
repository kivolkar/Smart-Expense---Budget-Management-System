import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Expense System API',
            version: '1.0.0',
            description: 'API documentation for the Smart Expense & Budget Management System',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8000}`,
                description: 'Local development server',
            },
            {
                url: 'https://your-production-app.com', // Replace with your real deployed URL later!
                description: 'Production server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT access token'
                },
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'refreshToken',
                }
            },
        },
        // We do not apply global security; we will apply it per-route for accuracy.
    },
    // Pattern to look for swagger annotations
    apis: ['./docs/*.yaml'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
