import { Router } from 'express';
import { createPromotion, getPromotions, updatePromotion, deletePromotion } from '../controllers/promotion.controller';
import { validate } from '../middleware/validate';
import { promotionSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *               - expirationDate
 *               - usageLimit
 *               - eligibleCategories
 *             properties:
 *               code:
 *                 type: string
 *                 example: TECHDEAL
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *                 example: FIXED
 *               discountValue:
 *                 type: number
 *                 example: 15
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *               usageLimit:
 *                 type: integer
 *                 example: 500
 *               eligibleCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["electronics", "gadgets"]
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Bad request (e.g., duplicate code)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of all promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 */
router.post('/', validate(promotionSchema), createPromotion);
router.get('/', getPromotions);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Promotion deleted successfully
 */
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;
