import request from 'supertest';
import app from '../app';

describe('API Health and Basic Tests', () => {
    describe('GET /health', () => {
        it('should return healthy status', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });

    describe('GET /', () => {
        it('should return API information', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('documentation', '/api-docs');
            expect(response.body).toHaveProperty('health', '/health');
        });
    });

    describe('GET /api-docs', () => {
        it('should return Swagger documentation page', async () => {
            const response = await request(app).get('/api-docs/');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Swagger');
        });
    });
});

describe('Voucher API Tests', () => {
    const testVoucher = {
        code: `TEST${Date.now()}`,
        discountType: 'PERCENTAGE',
        discountValue: 20,
        expirationDate: '2025-12-31',
        usageLimit: 100,
        minOrderValue: 50,
    };

    it('should create a new voucher', async () => {
        const response = await request(app)
            .post('/api/vouchers')
            .send(testVoucher);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.code).toBe(testVoucher.code);
        expect(response.body.discountType).toBe(testVoucher.discountType);
    });

    it('should not create voucher with duplicate code', async () => {
        // Create first voucher
        await request(app).post('/api/vouchers').send(testVoucher);

        // Try to create duplicate
        const response = await request(app)
            .post('/api/vouchers')
            .send(testVoucher);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Voucher code already exists');
    });

    it('should get all vouchers', async () => {
        const response = await request(app).get('/api/vouchers');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Promotion API Tests', () => {
    const testPromotion = {
        code: `PROMO${Date.now()}`,
        discountType: 'FIXED',
        discountValue: 15,
        expirationDate: '2025-12-31',
        usageLimit: 500,
        eligibleCategories: ['electronics', 'gadgets'],
    };

    it('should create a new promotion', async () => {
        const response = await request(app)
            .post('/api/promotions')
            .send(testPromotion);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.code).toBe(testPromotion.code);
        expect(response.body.eligibleCategories).toEqual(testPromotion.eligibleCategories);
    });

    it('should get all promotions', async () => {
        const response = await request(app).get('/api/promotions');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('Order Discount Application Tests', () => {
    let voucherCode: string;

    beforeAll(async () => {
        // Create a test voucher
        const voucher = {
            code: `ORDER_TEST${Date.now()}`,
            discountType: 'PERCENTAGE',
            discountValue: 25,
            expirationDate: '2025-12-31',
            usageLimit: 10,
            minOrderValue: 100,
        };
        const response = await request(app).post('/api/vouchers').send(voucher);
        voucherCode = response.body.code;
    });

    it('should apply voucher discount to order', async () => {
        const order = {
            items: [{ productId: '1', price: 200, category: 'clothing' }],
            voucherCode: voucherCode,
        };

        const response = await request(app)
            .post('/api/orders/apply-discount')
            .send(order);

        expect(response.status).toBe(201);
        expect(response.body.totalAmount).toBe(200);
        expect(response.body.discountApplied).toBe(50); // 25% of 200
        expect(response.body.finalAmount).toBe(150);
    });

    it('should reject order below minimum value', async () => {
        const order = {
            items: [{ productId: '1', price: 50, category: 'clothing' }],
            voucherCode: voucherCode,
        };

        const response = await request(app)
            .post('/api/orders/apply-discount')
            .send(order);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Minimum order value');
    });

    it('should reject applying both voucher and promotion', async () => {
        const order = {
            items: [{ productId: '1', price: 200, category: 'clothing' }],
            voucherCode: voucherCode,
            promotionCode: 'SOMEPROMO',
        };

        const response = await request(app)
            .post('/api/orders/apply-discount')
            .send(order);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Cannot apply both');
    });
});
