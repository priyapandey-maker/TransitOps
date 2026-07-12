import { z } from 'zod';

export const fuelSchema = z.object({
  vehicle_id: z.number().min(1, 'Please select a vehicle'),
  trip_id: z.number().nullable().optional(),
  liters: z.number().min(0.01, 'Liters must be greater than 0'),
  cost: z.number().min(0.01, 'Cost must be greater than 0'),
  date: z.string().min(1, 'Refuel date is required'),
});

export type FuelFormData = z.infer<typeof fuelSchema>;

export interface FuelLog {
  id: number;
  vehicle_id: number;
  registration_number?: string; // Hydrated for UI
  vehicle_name?: string; // Hydrated for UI
  trip_id?: number | null;
  liters: number;
  cost: number;
  date: string;
  created_at: string;
  updated_at: string;
}
