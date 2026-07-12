import { Router } from 'express';
import * as fuelController from '../controllers/fuel.controller';
import { validateFuel } from '../validators/fuel.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', validateFuel, fuelController.create);
router.get('/', fuelController.findAll);
router.get('/:id', fuelController.findById);

export default router;
