import { z } from 'zod';

export const maintenanceSchema = z.object({
  vehicle_id: z.number().min(1, 'Please select a vehicle'),
  maintenance_type: z.enum(['Routine Service', 'Repair', 'Inspection', 'Breakdown'], {
    message: 'Please select a valid maintenance type',
  }),
  description: z.string().min(1, 'Description is required').max(500),
  service_date: z.string().min(1, 'Service date is required'),
  next_due_date: z.string().optional().or(z.literal('')),
  assigned_technician: z.string().min(1, 'Assigned technician is required').max(100),
  cost: z.number().min(0, 'Cost cannot be negative'),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled']),
  notes: z.string().optional().or(z.literal('')),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

export interface Maintenance {
  id: number;
  vehicle_id: number;
  registration_number?: string; // Hydrated for UI
  vehicle_name?: string; // Hydrated for UI
  maintenance_type: 'Routine Service' | 'Repair' | 'Inspection' | 'Breakdown';
  description: string;
  service_date: string;
  next_due_date?: string;
  assigned_technician: string;
  cost: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}
