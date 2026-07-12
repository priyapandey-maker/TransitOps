import { z } from 'zod';
import type { TripStatus } from './common.types';

// Zod validation schema for Trip Form
export const tripSchema = z.object({
  vehicle_id: z.number().min(1, 'Please select a vehicle'),
  driver_id: z.number().min(1, 'Please select a driver'),
  source: z.string().min(1, 'Source location is required').max(100),
  destination: z.string().min(1, 'Destination location is required').max(100),
  cargo_weight: z.number().min(0.01, 'Cargo weight must be greater than 0'),
  planned_distance: z.number().min(1, 'Planned distance must be at least 1 km'),
});

export type TripFormData = z.infer<typeof tripSchema>;

export interface Trip {
  id: number;
  vehicle_id: number;
  driver_id: number;
  vehicle_name?: string; // Hydrated for UI
  registration_number?: string; // Hydrated for UI
  driver_name?: string; // Hydrated for UI
  source: string;
  destination: string;
  cargo_weight: number;
  planned_distance: number;
  final_distance?: number;
  fuel_consumed?: number;
  status: TripStatus;
  dispatched_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TripStatusHistory {
  id: number;
  trip_id: number;
  previous_status: TripStatus;
  new_status: TripStatus;
  changed_at: string;
}
