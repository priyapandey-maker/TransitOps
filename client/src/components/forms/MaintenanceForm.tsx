import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceSchema } from '../../types/maintenance.types';
import type { MaintenanceFormData } from '../../types/maintenance.types';
import { getVehicles } from '../../services/vehicle.api';
import type { Vehicle } from '../../types/vehicle.types';
import Loader from '../common/Loader';

interface MaintenanceFormProps {
  initialValues?: MaintenanceFormData;
  onSubmit: (data: MaintenanceFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function MaintenanceForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: MaintenanceFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicle_id: undefined,
      maintenance_type: 'Routine Service',
      description: '',
      service_date: new Date().toISOString().split('T')[0],
      next_due_date: '',
      assigned_technician: '',
      cost: 0,
      status: 'Scheduled',
      notes: '',
    },
  });

  // Load vehicles list
  useEffect(() => {
    async function loadVehicles() {
      setDataLoading(true);
      try {
        const response = await getVehicles();
        if (response.success) {
          setVehicles(response.data);
        }
      } catch (err) {
        console.error(err);
        setLoadError('Failed to load fleet vehicles list.');
      } finally {
        setDataLoading(false);
      }
    }

    loadVehicles();
  }, []);

  // Sync initialValues in edit mode
  useEffect(() => {
    if (initialValues) {
      setValue('vehicle_id', initialValues.vehicle_id);
      setValue('maintenance_type', initialValues.maintenance_type);
      setValue('description', initialValues.description);
      setValue('service_date', initialValues.service_date);
      setValue('next_due_date', initialValues.next_due_date || '');
      setValue('assigned_technician', initialValues.assigned_technician);
      setValue('cost', initialValues.cost);
      setValue('status', initialValues.status);
      setValue('notes', initialValues.notes || '');
    }
  }, [initialValues, setValue]);

  if (dataLoading) {
    return <Loader message="Fetching fleet vehicles..." />;
  }

  if (loadError) {
    return (
      <div className="p-4 text-center space-y-4">
        <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Vehicle select dropdown */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Select Vehicle
        </label>
        <select
          {...register('vehicle_id', { valueAsNumber: true })}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.vehicle_id ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        >
          <option value="">Select a vehicle...</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.registration_number} - {v.vehicle_name} ({v.status})
            </option>
          ))}
        </select>
        {errors.vehicle_id && (
          <p className="text-xs text-red-500 mt-1">{errors.vehicle_id.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Maintenance Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Service Type
          </label>
          <select
            {...register('maintenance_type')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.maintenance_type ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          >
            <option value="Routine Service">Routine Service</option>
            <option value="Repair">Repair</option>
            <option value="Inspection">Inspection</option>
            <option value="Breakdown">Breakdown</option>
          </select>
          {errors.maintenance_type && (
            <p className="text-xs text-red-500 mt-1">{errors.maintenance_type.message}</p>
          )}
        </div>

        {/* Assigned Technician */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Assigned Technician
          </label>
          <input
            type="text"
            {...register('assigned_technician')}
            placeholder="e.g. John Miller"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.assigned_technician ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.assigned_technician && (
            <p className="text-xs text-red-500 mt-1">{errors.assigned_technician.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Issue Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Detailed service descriptions..."
          rows={2}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Service Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Service Date
          </label>
          <input
            type="date"
            {...register('service_date')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.service_date ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.service_date && (
            <p className="text-xs text-red-500 mt-1">{errors.service_date.message}</p>
          )}
        </div>

        {/* Next Due Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Next Due Date (Optional)
          </label>
          <input
            type="date"
            {...register('next_due_date')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.next_due_date ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.next_due_date && (
            <p className="text-xs text-red-500 mt-1">{errors.next_due_date.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Estimated Cost */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Service Cost (₹)
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
              ${errors.status ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          >
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Operator / Mechanic Notes
        </label>
        <textarea
          {...register('notes')}
          placeholder="Add any additional context..."
          rows={2}
          className="
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
          "
          disabled={loading}
        />
      </div>

      {/* Action Buttons */}
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
