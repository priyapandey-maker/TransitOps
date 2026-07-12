import { z } from 'zod';

// Zod validation schema for Vehicle Form
export const vehicleSchema = z.object({
  registration_number: z
    .string()
    .min(1, 'Registration number is required')
    .max(20, 'Registration number must be under 20 characters')
    .regex(/^[A-Z0-9- ]+$/i, 'Registration number must contain only letters, numbers, hyphens, and spaces'),
  vehicle_name: z.string().min(1, 'Vehicle name is required').max(100),
  vehicle_type: z.enum(['Bus', 'Truck', 'Van', 'Car', 'SUV'], {
    message: 'Please select a valid vehicle type',
  }),
  max_load_capacity: z.number()
    .min(0.01, 'Capacity must be greater than 0'),
  odometer: z.number()
    .min(0, 'Odometer cannot be negative'),
  acquisition_cost: z.number()
    .min(0, 'Acquisition cost cannot be negative'),
  status: z.enum(['Available', 'On Trip', 'In Shop', 'Retired']),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type VehicleType = 'Bus' | 'Truck' | 'Van' | 'Car' | 'SUV';
export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';

export interface Vehicle {
  id: number;
  registration_number: string;
  vehicle_name: string;
  vehicle_type: VehicleType;
  max_load_capacity: number;
  odometer: number;
  acquisition_cost: number;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

