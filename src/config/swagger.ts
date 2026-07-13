import swaggerJsdoc from 'swagger-jsdoc';
export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Roop Rang Cosmetics API', version: '1.0.0', description: 'Production REST API for Roop Rang - Luxury Cosmetics' },
    servers: [{ url: 'http://localhost:5000/api', description: 'Development' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } }
  },
  apis: ['./src/routes/*.ts']
});
