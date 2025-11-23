import { Router } from 'express';
import { createVoucher, getVouchers, updateVoucher, deleteVoucher } from '../controllers/voucher.controller';
import { validate } from '../middleware/validate';
import { voucherSchema } from '../validators/schemas';

const router = Router();

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new voucher
 *     tags: [Vouchers]
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
 *             properties:
 *               code:
 *                 type: string
 *                 example: SAVE20
 *               discountType:
 *                 type: string
 *                 enum: [PERCENTAGE, FIXED]
 *                 example: PERCENTAGE
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-31
 *               usageLimit:
 *                 type: integer
 *                 example: 100
 *               minOrderValue:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Voucher'
 *       400:
 *         description: Bad request (e.g., duplicate code)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get all vouchers
 *     tags: [Vouchers]
 *     responses:
 *       200:
 *         description: List of all vouchers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Voucher'
 */
router.post('/', validate(voucherSchema), createVoucher);
router.get('/', getVouchers);

/**
 * @swagger
 * /api/vouchers/{id}:
 *   put:
 *     summary: Update a voucher
 *     tags: [Vouchers]
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
 *         description: Voucher updated successfully
 *   delete:
 *     summary: Delete a voucher
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Voucher deleted successfully
 */
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);

export default router;
