import { Router } from 'express';
import { getAvailableServices } from '../controllers/services.controller.js';

const router = Router();

router.get('/', getAvailableServices);

export default router;
