import { Router } from 'express';
import * as driverController from '../controllers/driver.controller';
import { validateDriver, validateDriverStatus } from '../validators/driver.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Assuming authentication is required for fleet management
router.use(authenticate);

router.post('/', validateDriver, driverController.create);
router.get('/', driverController.findAll);
router.get('/:id', driverController.findById);
router.put('/:id', validateDriver, driverController.update);
router.patch('/:id/status', validateDriverStatus, driverController.updateStatus);

export default router;
