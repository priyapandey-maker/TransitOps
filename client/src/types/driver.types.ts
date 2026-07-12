import { z } from 'zod';

// Zod validation schema for Driver Form
export const driverSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  license_number: z
    .string()
    .min(1, 'License number is required')
    .max(50, 'License number must be under 50 characters')
    .regex(/^[A-Z0-9-/ ]+$/i, 'Invalid license format'),
  license_category: z.enum(['A', 'B', 'C', 'D', 'E'], {
    message: 'Please select a valid license category',
  }),
  license_expiry: z
    .string()
    .min(1, 'License expiry date is required')
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      // Set hours to 0 to compare dates only
      today.setHours(0, 0, 0, 0);
      return date > today;
    }, 'License expiry date must be in the future'),
  contact_number: z
    .string()
    .min(1, 'Contact number is required')
    .max(20, 'Contact number is too long')
    .regex(/^\+?[0-9-\s]+$/, 'Invalid contact number format'),
  safety_score: z.number()
    .min(0, 'Safety score cannot be less than 0')
    .max(100, 'Safety score cannot exceed 100'),
  status: z.enum(['Available', 'On Trip', 'Off Duty', 'Suspended']),
});

export type DriverFormData = z.infer<typeof driverSchema>;
export type LicenseCategory = 'A' | 'B' | 'C' | 'D' | 'E';
export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_category: LicenseCategory;
  license_expiry: string;
  contact_number: string;
  safety_score: number;
  status: DriverStatus;
  created_at: string;
  updated_at: string;
}

