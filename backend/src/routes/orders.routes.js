import { Router } from 'express';
import { getActiveOrders } from '../controllers/orders.controller.js';

const router = Router();

router.get('/', getActiveOrders);

export default router;
