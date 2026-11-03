import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getManagedServices, createManagedService, patchManagedService } from '../controllers/services.admin.controller.js';
const router = Router();
router.use(requireAuth);
router.get('/manage', getManagedServices);
router.post('/', createManagedService);
router.patch('/:id', patchManagedService);
export default router;
