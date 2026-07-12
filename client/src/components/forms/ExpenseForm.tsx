import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema } from '../../types/expense.types';
import type { ExpenseFormData } from '../../types/expense.types';
import { getVehicles } from '../../services/vehicle.api';
import type { Vehicle } from '../../types/vehicle.types';

interface ExpenseFormProps {
  initialValues?: ExpenseFormData;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ExpenseForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: ExpenseFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      vehicle_id: null,
      trip_id: null,
      amount: 0,
      category: 'Misc',
      description: '',
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
      {/* Category Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Expense Category
        </label>
        <select
          {...register('category')}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        >
          <option value="Fuel">Fuel</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Toll">Toll</option>
          <option value="Misc">Miscellaneous</option>
        </select>
        {errors.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
        )}
      </div>

      {/* Vehicle select (Optional) */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Vehicle Asset (Optional)
        </label>
        <select
          {...register('vehicle_id', {
            setValueAs: (value) => (value === '' ? null : Number(value)),
          })}
          className="
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
          "
          disabled={loading || vehiclesLoading}
        >
          <option value="">-- No Specific Vehicle --</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>
              {v.vehicle_name} ({v.registration_number})
            </option>
          ))}
        </select>
      </div>

      {/* Cost Amount */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Expense Cost (₹)
        </label>
        <input
          type="number"
          {...register('amount', { valueAsNumber: true })}
          placeholder="0"
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        />
        {errors.amount && (
          <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Expense Date
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
            {...register('trip_id', {
              setValueAs: (value) => (value === '' ? null : Number(value)),
            })}
            placeholder="e.g. 1"
            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Description / Purpose
        </label>
        <textarea
          {...register('description')}
          placeholder="e.g. Fuel purchase for Nagpur route..."
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          rows={3}
          disabled={loading}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
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
          {loading ? 'Logging Expense...' : 'Log Expense'}
        </button>
      </div>
    </form>
  );
}
