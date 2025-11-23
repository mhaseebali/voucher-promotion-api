import { z } from 'zod';

export const voucherSchema = z.object({
    code: z.string().min(3).max(50),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive(),
    expirationDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    usageLimit: z.number().int().positive(),
    minOrderValue: z.number().positive().optional(),
});

export const promotionSchema = z.object({
    code: z.string().min(3).max(50),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive(),
    expirationDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    usageLimit: z.number().int().positive(),
    eligibleCategories: z.array(z.string()).min(1),
});

export const orderSchema = z.object({
    items: z.array(
        z.object({
            productId: z.string(),
            price: z.number().positive(),
            category: z.string(),
        })
    ).min(1),
    voucherCode: z.string().optional(),
    promotionCode: z.string().optional(),
});

export type VoucherInput = z.infer<typeof voucherSchema>;
export type PromotionInput = z.infer<typeof promotionSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
