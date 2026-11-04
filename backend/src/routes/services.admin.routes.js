import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth.js';
import { getManagedServices, createManagedService, patchManagedService } from '../controllers/services.admin.controller.js';
const router = Router();
router.get('/manage', requireAuth, getManagedServices);
router.post('/', requireAuth, createManagedService);
router.patch('/:id', requireAuth, patchManagedService);
export default router;
