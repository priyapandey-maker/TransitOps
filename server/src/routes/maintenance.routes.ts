import { Router } from 'express';
import * as maintController from '../controllers/maintenance.controller';
import { validateMaintenance } from '../validators/maintenance.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', validateMaintenance, maintController.create);
router.get('/', maintController.findAll);
router.get('/:id', maintController.findById);
router.patch('/:id/close', maintController.closeMaintenance);

export default router;
