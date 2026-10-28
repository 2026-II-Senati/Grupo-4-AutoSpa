import { Router } from 'express';
import { createOrder } from '../controllers/orders.controller.js';

const router = Router();

router.post('/', createOrder);

export default router;