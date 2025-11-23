import prisma from '../prisma';

const MAX_DISCOUNT_PERCENTAGE = 50;

export const validateAndApplyVoucher = async (code: string, totalAmount: number) => {
    const voucher = await prisma.voucher.findUnique({ where: { code } });
    if (!voucher) throw new Error('Invalid voucher code');

    if (new Date() > voucher.expirationDate) throw new Error('Voucher expired');
    if (voucher.usedCount >= voucher.usageLimit) throw new Error('Voucher usage limit exceeded');
    if (voucher.minOrderValue && totalAmount < voucher.minOrderValue) throw new Error(`Minimum order value of ${voucher.minOrderValue} required`);

    let discount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
        discount = (totalAmount * voucher.discountValue) / 100;
    } else {
        discount = voucher.discountValue;
    }

    // Cap discount
    const maxDiscount = (totalAmount * MAX_DISCOUNT_PERCENTAGE) / 100;
    if (discount > maxDiscount) {
        discount = maxDiscount;
    }

    return { discount, voucherId: voucher.id };
};

export const validateAndApplyPromotion = async (code: string, items: any[]) => {
    const promotion = await prisma.promotion.findUnique({ where: { code } });
    if (!promotion) throw new Error('Invalid promotion code');

    if (new Date() > promotion.expirationDate) throw new Error('Promotion expired');
    if (promotion.usedCount >= promotion.usageLimit) throw new Error('Promotion usage limit exceeded');

    const eligibleCategories = JSON.parse(promotion.eligibleCategories);
    const eligibleItems = items.filter((item: any) => eligibleCategories.includes(item.category));

    if (eligibleItems.length === 0) throw new Error('No eligible items for this promotion');

    const eligibleAmount = eligibleItems.reduce((sum: number, item: any) => sum + item.price, 0);

    let discount = 0;
    if (promotion.discountType === 'PERCENTAGE') {
        discount = (eligibleAmount * promotion.discountValue) / 100;
    } else {
        discount = promotion.discountValue;
    }

    // Cap discount based on total order value (or eligible value? Requirement says "limit ... to an order")
    // I'll cap based on total order value to be safe, or eligible amount.
    // Let's cap based on eligible amount to be stricter.
    const maxDiscount = (eligibleAmount * MAX_DISCOUNT_PERCENTAGE) / 100;
    if (discount > maxDiscount) {
        discount = maxDiscount;
    }

    return { discount, promotionId: promotion.id };
};
