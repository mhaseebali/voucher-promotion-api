import { Request, Response } from 'express';
import prisma from '../prisma';
import { Promotion } from '@prisma/client';

export const createPromotion = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountValue, expirationDate, usageLimit, eligibleCategories } = req.body;
        // eligibleCategories should be an array of strings, we store as JSON string
        const promotion = await prisma.promotion.create({
            data: {
                code,
                discountType,
                discountValue,
                expirationDate: new Date(expirationDate),
                usageLimit,
                eligibleCategories: JSON.stringify(eligibleCategories)
            }
        });
        res.status(201).json({ ...promotion, eligibleCategories: JSON.parse(promotion.eligibleCategories) });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create promotion', details: error.message });
    }
};

export const getPromotions = async (req: Request, res: Response) => {
    try {
        const promotions = await prisma.promotion.findMany();
        const parsedPromotions = promotions.map((p: Promotion) => ({
            ...p,
            eligibleCategories: JSON.parse(p.eligibleCategories)
        }));
        res.json(parsedPromotions);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch promotions', details: error.message });
    }
};

export const updatePromotion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.expirationDate) {
            data.expirationDate = new Date(data.expirationDate);
        }
        if (data.eligibleCategories) {
            data.eligibleCategories = JSON.stringify(data.eligibleCategories);
        }
        const promotion = await prisma.promotion.update({
            where: { id: Number(id) },
            data
        });
        res.json({ ...promotion, eligibleCategories: JSON.parse(promotion.eligibleCategories) });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update promotion', details: error.message });
    }
};

export const deletePromotion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.promotion.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete promotion', details: error.message });
    }
};
