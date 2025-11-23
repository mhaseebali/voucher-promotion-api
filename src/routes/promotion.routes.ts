import { Router } from 'express';
import { createPromotion, getPromotions, updatePromotion, deletePromotion } from '../controllers/promotion.controller';

const router = Router();

router.post('/', createPromotion);
router.get('/', getPromotions);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;
