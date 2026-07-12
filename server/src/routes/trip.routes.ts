import { Router } from 'express';
import * as tripController from '../controllers/trip.controller';
import { validateCreateTrip } from '../validators/trip.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Authentication required for trips
router.use(authenticate);

router.post('/', validateCreateTrip, tripController.create);
router.get('/', tripController.findAll);
router.get('/:id', tripController.findById);

router.patch('/:id/dispatch', tripController.dispatchTrip);
router.patch('/:id/complete', tripController.completeTrip);
router.patch('/:id/cancel', tripController.cancelTrip);

export default router;
