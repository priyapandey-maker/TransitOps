import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller';
import { validateExpense } from '../validators/expense.validator';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', validateExpense, expenseController.create);
router.get('/', expenseController.findAll);
router.get('/:id', expenseController.findById);

export default router;
