import swaggerDocs from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerDocs.Options = {
    definition: {
    openapi: '3.0.0',
    info: {
    title: 'AI PDF Extractor API',
      version: '1.0.0',
      description: 'API for uploading, processing, and extracting structured data from PDF files using AI-powered extraction techniques.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.ts']
}

const swaggerSpec = swaggerDocs(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}