import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller';
import { validateVehicle, validateVehicleStatus } from '../validators/vehicle.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Assuming authentication is required for fleet management
router.use(authenticate);

router.post('/', validateVehicle, vehicleController.create);
router.get('/', vehicleController.findAll);
router.get('/:id', vehicleController.findById);
router.put('/:id', validateVehicle, vehicleController.update);
router.patch('/:id/status', validateVehicleStatus, vehicleController.updateStatus);

export default router;
