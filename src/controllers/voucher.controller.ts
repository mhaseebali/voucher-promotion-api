import { Request, Response } from 'express';
import prisma from '../prisma';

export const createVoucher = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountValue, expirationDate, usageLimit, minOrderValue } = req.body;
        const voucher = await prisma.voucher.create({
            data: {
                code,
                discountType,
                discountValue,
                expirationDate: new Date(expirationDate),
                usageLimit,
                minOrderValue
            }
        });
        res.status(201).json(voucher);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create voucher', details: error.message });
    }
};

export const getVouchers = async (req: Request, res: Response) => {
    try {
        const vouchers = await prisma.voucher.findMany();
        res.json(vouchers);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch vouchers', details: error.message });
    }
};

export const updateVoucher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.expirationDate) {
            data.expirationDate = new Date(data.expirationDate);
        }
        const voucher = await prisma.voucher.update({
            where: { id: Number(id) },
            data
        });
        res.json(voucher);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to update voucher', details: error.message });
    }
};

export const deleteVoucher = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.voucher.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to delete voucher', details: error.message });
    }
};
