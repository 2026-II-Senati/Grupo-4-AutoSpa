import { Router } from 'express';
import { createOrder, getActiveOrders } from '../controllers/orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.get('/', getActiveOrders);

export default router;