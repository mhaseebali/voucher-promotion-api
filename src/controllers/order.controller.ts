import { Request, Response } from 'express';
import prisma from '../prisma';
import { validateAndApplyVoucher, validateAndApplyPromotion } from '../services/discount.service';

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, voucherCode, promotionCode } = req.body;
        // items: [{ productId, price, category }]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Items are required and must be an array' });
        }

        const totalAmount = items.reduce((sum: number, item: any) => sum + item.price, 0);
        let discountApplied = 0;
        let finalAmount = totalAmount;
        let voucherId = null;
        let promotionId = null;

        if (voucherCode && promotionCode) {
            return res.status(400).json({ error: 'Cannot apply both voucher and promotion' });
        }

        if (voucherCode) {
            const result = await validateAndApplyVoucher(voucherCode, totalAmount);
            discountApplied = result.discount;
            voucherId = result.voucherId;
        } else if (promotionCode) {
            const result = await validateAndApplyPromotion(promotionCode, items);
            discountApplied = result.discount;
            promotionId = result.promotionId;
        }

        finalAmount = totalAmount - discountApplied;
        if (finalAmount < 0) finalAmount = 0;

        // Create Order
        const order = await prisma.order.create({
            data: {
                totalAmount,
                discountApplied,
                finalAmount,
                voucherCode,
                promotionCode,
                items: JSON.stringify(items)
            }
        });

        // Increment usage count
        if (voucherId) {
            await prisma.voucher.update({ where: { id: voucherId }, data: { usedCount: { increment: 1 } } });
        }
        if (promotionId) {
            await prisma.promotion.update({ where: { id: promotionId }, data: { usedCount: { increment: 1 } } });
        }

        res.status(201).json(order);

    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
