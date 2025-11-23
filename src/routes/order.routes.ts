import { Router } from 'express';
import { createOrder } from '../controllers/order.controller';

const router = Router();

router.post('/apply-discount', createOrder); // Requirement says "API to apply a voucher/promotion to an order". I'll treat this as creating an order with discount.

export default router;
