import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Voucher & Promotion API',
            version: '1.0.0',
            description: 'API for managing vouchers, promotions, and applying discounts to orders',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
            {
                url: 'https://voucher-promotion-api.onrender.com',
                description: 'Production server',
            },
        ],
        components: {
            schemas: {
                Voucher: {
                    type: 'object',
                    required: ['code', 'discountType', 'discountValue', 'expirationDate', 'usageLimit'],
                    properties: {
                        id: { type: 'integer', example: 1 },
                        code: { type: 'string', example: 'SAVE20' },
                        discountType: { type: 'string', enum: ['PERCENTAGE', 'FIXED'], example: 'PERCENTAGE' },
                        discountValue: { type: 'number', example: 20 },
                        expirationDate: { type: 'string', format: 'date', example: '2025-12-31' },
                        usageLimit: { type: 'integer', example: 100 },
                        usedCount: { type: 'integer', example: 0 },
                        minOrderValue: { type: 'number', nullable: true, example: 50 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Promotion: {
                    type: 'object',
                    required: ['code', 'discountType', 'discountValue', 'expirationDate', 'usageLimit', 'eligibleCategories'],
                    properties: {
                        id: { type: 'integer', example: 1 },
                        code: { type: 'string', example: 'TECHDEAL' },
                        discountType: { type: 'string', enum: ['PERCENTAGE', 'FIXED'], example: 'FIXED' },
                        discountValue: { type: 'number', example: 15 },
                        expirationDate: { type: 'string', format: 'date', example: '2025-12-31' },
                        usageLimit: { type: 'integer', example: 500 },
                        usedCount: { type: 'integer', example: 0 },
                        eligibleCategories: { type: 'array', items: { type: 'string' }, example: ['electronics', 'gadgets'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Order: {
                    type: 'object',
                    required: ['items'],
                    properties: {
                        id: { type: 'integer', example: 1 },
                        totalAmount: { type: 'number', example: 200 },
                        discountApplied: { type: 'number', example: 40 },
                        finalAmount: { type: 'number', example: 160 },
                        voucherCode: { type: 'string', nullable: true, example: 'SAVE20' },
                        promotionCode: { type: 'string', nullable: true, example: null },
                        items: { type: 'string', example: '[{"productId":"1","price":200,"category":"clothing"}]' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        details: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
