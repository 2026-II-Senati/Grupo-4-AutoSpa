import { Router } from 'express';
import { createOrder, getActiveOrders, patchOrderStatus } from '../controllers/orders.controller.js';
import { requireAuth } from '../middleware/require-auth.js';

const router = Router();

router.post('/', requireAuth, createOrder);
router.patch('/:id/status', requireAuth, patchOrderStatus);
router.get('/', requireAuth, getActiveOrders);

export default router;
