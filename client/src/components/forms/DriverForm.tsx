import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema } from '../../types/driver.types';
import type { DriverFormData } from '../../types/driver.types';

interface DriverFormProps {
  initialValues?: DriverFormData;
  onSubmit: (data: DriverFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function DriverForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: DriverFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: '',
      license_number: '',
      license_category: 'C',
      license_expiry: '',
      contact_number: '',
      safety_score: 100,
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
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Full Name
        </label>
        <input
          type="text"
          {...register('name')}
          placeholder="e.g. John Doe"
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* License Number */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          License Number
        </label>
        <input
          type="text"
          {...register('license_number')}
          placeholder="e.g. DL-1234567890123"
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.license_number ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        />
        {errors.license_number && (
          <p className="text-xs text-red-500 mt-1">{errors.license_number.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* License Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            License Class
          </label>
          <select
            {...register('license_category')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.license_category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          >
            <option value="A">Class A</option>
            <option value="B">Class B</option>
            <option value="C">Class C</option>
            <option value="D">Class D</option>
            <option value="E">Class E</option>
          </select>
          {errors.license_category && (
            <p className="text-xs text-red-500 mt-1">{errors.license_category.message}</p>
          )}
        </div>

        {/* License Expiry */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            License Expiry
          </label>
          <input
            type="date"
            {...register('license_expiry')}
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.license_expiry ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.license_expiry && (
            <p className="text-xs text-red-500 mt-1">{errors.license_expiry.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Contact Number */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Contact Number
          </label>
          <input
            type="text"
            {...register('contact_number')}
            placeholder="e.g. +91 98765 43210"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.contact_number ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.contact_number && (
            <p className="text-xs text-red-500 mt-1">{errors.contact_number.message}</p>
          )}
        </div>

        {/* Safety Score */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Safety Score
          </label>
          <input
            type="number"
            {...register('safety_score', { valueAsNumber: true })}
            placeholder="100"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.safety_score ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.safety_score && (
            <p className="text-xs text-red-500 mt-1">{errors.safety_score.message}</p>
          )}
        </div>
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
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>
        {errors.status && (
          <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
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
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
