import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fuelSchema } from '../../types/fuel.types';
import type { FuelFormData } from '../../types/fuel.types';
import { getVehicles } from '../../services/vehicle.api';
import type { Vehicle } from '../../types/vehicle.types';

interface FuelFormProps {
  initialValues?: FuelFormData;
  onSubmit: (data: FuelFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function FuelForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: FuelFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FuelFormData>({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      vehicle_id: undefined,
      trip_id: null,
      liters: 0,
      cost: 0,
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Load vehicles list for selection
  useEffect(() => {
    async function loadVehicles() {
      setVehiclesLoading(true);
      try {
        const response = await getVehicles();
        if (response.success) {
          // exclude retired units
          setVehicles(response.data.filter(v => v.status !== 'Retired'));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setVehiclesLoading(false);
      }
    }
    loadVehicles();
  }, []);

  // Sync initialValues when editing
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Vehicle select */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Vehicle Asset
        </label>
        <select
          {...register('vehicle_id', { valueAsNumber: true })}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.vehicle_id ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading || vehiclesLoading}
        >
          <option value="">-- Select Active Vehicle --</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>
              {v.vehicle_name} ({v.registration_number})
            </option>
          ))}
        </select>
        {errors.vehicle_id && (
          <p className="text-xs text-red-500 mt-1">{errors.vehicle_id.message}</p>
        )}
      </div>

      {/* Liters & Cost */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Fuel Amount (Liters)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('liters', { valueAsNumber: true })}
            placeholder="0.00"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.liters ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.liters && (
            <p className="text-xs text-red-500 mt-1">{errors.liters.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Refuel Cost (₹)
          </label>
          <input
            type="number"
            {...register('cost', { valueAsNumber: true })}
            placeholder="0"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.cost ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.cost && (
            <p className="text-xs text-red-500 mt-1">{errors.cost.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Refuel Date
          </label>
          <input
            type="date"
            {...register('date')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.date ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.date && (
            <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Optional Trip ID */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Trip Association ID (Optional)
          </label>
          <input
            type="number"
            {...register('trip_id', { valueAsNumber: true })}
            placeholder="e.g. 1"
            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
            disabled={loading}
          />
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
          {loading ? 'Adding Log...' : 'Add Log'}
        </button>
      </div>
    </form>
  );
}
