import { Router } from 'express';
import { createOrder, getActiveOrders, patchOrderStatus } from '../controllers/orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.patch('/:id/status', patchOrderStatus);
router.get('/', getActiveOrders);

export default router;
