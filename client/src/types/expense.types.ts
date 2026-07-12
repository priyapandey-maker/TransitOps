import { z } from 'zod';

export const expenseSchema = z.object({
  vehicle_id: z.number().nullable().optional(),
  trip_id: z.number().nullable().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.enum(['Fuel', 'Maintenance', 'Toll', 'Misc'], {
    message: 'Please select a valid category',
  }),
  description: z.string().max(250).optional().or(z.literal('')),
  date: z.string().min(1, 'Expense date is required'),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export interface Expense {
  id: number;
  vehicle_id?: number | null;
  registration_number?: string; // Hydrated for UI
  vehicle_name?: string; // Hydrated for UI
  trip_id?: number | null;
  amount: number;
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Misc';
  description?: string;
  date: string;
  created_at: string;
  updated_at: string;
}
