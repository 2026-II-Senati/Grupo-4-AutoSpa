import { Router } from 'express';
import { createOrder, getActiveOrders } from '../controllers/orders.controller.js';
import { requireAuth } from '../middleware/require-auth.js';

const router = Router();

router.post('/', createOrder);
router.get('/', requireAuth, getActiveOrders);

export default router;