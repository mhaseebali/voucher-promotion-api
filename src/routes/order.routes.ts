import { Router } from 'express';
import { createOrder } from '../controllers/order.controller';
import { validate } from '../middleware/validate';
import { orderSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /api/orders/apply-discount:
 *   post:
 *     summary: Apply a voucher or promotion to an order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: string
 *                 example: [{"productId": "1", "price": 200, "category": "clothing"}]
 *               voucherCode:
 *                 type: string
 *                 example: SAVE20
 *               promotionCode:
 *                 type: string
 *                 example: TECHDEAL
 *     responses:
 *       201:
 *         description: Order created with discount applied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid request or discount rules not met
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/apply-discount', validate(orderSchema), createOrder);

export default router;
