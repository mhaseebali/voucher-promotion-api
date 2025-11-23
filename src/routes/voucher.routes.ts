import { Router } from 'express';
import { createVoucher, getVouchers, updateVoucher, deleteVoucher } from '../controllers/voucher.controller';

const router = Router();

router.post('/', createVoucher);
router.get('/', getVouchers);
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);

export default router;
