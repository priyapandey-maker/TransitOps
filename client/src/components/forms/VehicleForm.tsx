import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema } from '../../types/vehicle.types';
import type { VehicleFormData } from '../../types/vehicle.types';

interface VehicleFormProps {
  initialValues?: VehicleFormData;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function VehicleForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registration_number: '',
      vehicle_name: '',
      vehicle_type: 'Truck',
      max_load_capacity: 0,
      odometer: 0,
      acquisition_cost: 0,
      status: 'Available',
    },
  });

  // Sync initialValues when editing
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Registration number */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Registration Number
        </label>
        <input
          type="text"
          {...register('registration_number')}
          placeholder="e.g. MH-12-AB-1234"
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.registration_number ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        />
        {errors.registration_number && (
          <p className="text-xs text-red-500 mt-1">{errors.registration_number.message}</p>
        )}
      </div>

      {/* Vehicle Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Vehicle Name / Model
        </label>
        <input
          type="text"
          {...register('vehicle_name')}
          placeholder="e.g. Tata Signa 4018"
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.vehicle_name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        />
        {errors.vehicle_name && (
          <p className="text-xs text-red-500 mt-1">{errors.vehicle_name.message}</p>
        )}
      </div>

      {/* Vehicle Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Vehicle Type
        </label>
        <select
          {...register('vehicle_type')}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.vehicle_type ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        >
          <option value="Truck">Truck</option>
          <option value="Bus">Bus</option>
          <option value="Van">Van</option>
          <option value="Car">Car</option>
          <option value="SUV">SUV</option>
        </select>
        {errors.vehicle_type && (
          <p className="text-xs text-red-500 mt-1">{errors.vehicle_type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Load Capacity */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Capacity (Tons)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('max_load_capacity', { valueAsNumber: true })}
            placeholder="0.00"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.max_load_capacity ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.max_load_capacity && (
            <p className="text-xs text-red-500 mt-1">{errors.max_load_capacity.message}</p>
          )}
        </div>

        {/* Odometer */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Odometer (km)
          </label>
          <input
            type="number"
            {...register('odometer', { valueAsNumber: true })}
            placeholder="0"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.odometer ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.odometer && (
            <p className="text-xs text-red-500 mt-1">{errors.odometer.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Acquisition Cost */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Cost (₹)
          </label>
          <input
            type="number"
            {...register('acquisition_cost', { valueAsNumber: true })}
            placeholder="0"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.acquisition_cost ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.acquisition_cost && (
            <p className="text-xs text-red-500 mt-1">{errors.acquisition_cost.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.status ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-150 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="
            px-4.5 py-2.5 text-sm font-medium rounded-buttons border border-slate-200 dark:border-slate-800
            text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800
            transition-saas btn-press
          "
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="
            px-4.5 py-2.5 text-sm font-medium rounded-buttons text-white bg-primary-500 hover:bg-primary-600
            shadow-sm shadow-primary-500/10 transition-saas btn-press
          "
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
