import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema } from '../../types/trip.types';
import type { TripFormData } from '../../types/trip.types';
import { getVehicles } from '../../services/vehicle.api';
import { getDrivers } from '../../services/driver.api';
import type { Vehicle } from '../../types/vehicle.types';
import type { Driver } from '../../types/driver.types';
import Loader from '../common/Loader';

interface TripFormProps {
  initialValues?: TripFormData;
  onSubmit: (data: TripFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function TripForm({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: TripFormProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      vehicle_id: undefined,
      driver_id: undefined,
      source: '',
      destination: '',
      cargo_weight: 0,
      planned_distance: 0,
    },
  });

  // Load vehicles and drivers list
  useEffect(() => {
    async function loadFormData() {
      setDataLoading(true);
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          getVehicles(),
          getDrivers(),
        ]);

        if (vehiclesRes.success && driversRes.success) {
          // Filter: only show Available or currently selected ones in edit mode
          const avVehicles = vehiclesRes.data.filter(
            (v) => v.status === 'Available' || v.id === initialValues?.vehicle_id
          );
          const avDrivers = driversRes.data.filter(
            (d) => d.status === 'Available' || d.id === initialValues?.driver_id
          );

          setVehicles(avVehicles);
          setDrivers(avDrivers);
        }
      } catch (err) {
        console.error(err);
        setLoadError('Failed to load available fleet or driver data.');
      } finally {
        setDataLoading(false);
      }
    }

    loadFormData();
  }, [initialValues]);

  // Sync initialValues in edit mode
  useEffect(() => {
    if (initialValues) {
      setValue('vehicle_id', initialValues.vehicle_id);
      setValue('driver_id', initialValues.driver_id);
      setValue('source', initialValues.source);
      setValue('destination', initialValues.destination);
      setValue('cargo_weight', initialValues.cargo_weight);
      setValue('planned_distance', initialValues.planned_distance);
    }
  }, [initialValues, setValue]);

  // Watch selected vehicle and cargo weight for real-time validation
  const selectedVehicleId = useWatch({ control, name: 'vehicle_id' });
  const cargoWeight = useWatch({ control, name: 'cargo_weight' });

  useEffect(() => {
    if (selectedVehicleId && cargoWeight) {
      const vehicle = vehicles.find((v) => v.id === Number(selectedVehicleId));
      if (vehicle && Number(cargoWeight) > vehicle.max_load_capacity) {
        setError('cargo_weight', {
          type: 'custom',
          message: `Cargo weight (${cargoWeight} Tons) exceeds vehicle capacity (${vehicle.max_load_capacity} Tons).`,
        });
      } else {
        clearErrors('cargo_weight');
      }
    }
  }, [selectedVehicleId, cargoWeight, vehicles, setError, clearErrors]);

  const onFormSubmit = (data: TripFormData) => {
    // Re-verify cargo capacity constraint before submitting
    const vehicle = vehicles.find((v) => v.id === Number(data.vehicle_id));
    if (vehicle && data.cargo_weight > vehicle.max_load_capacity) {
      setError('cargo_weight', {
        type: 'custom',
        message: `Cargo weight exceeds selected vehicle's capacity (${vehicle.max_load_capacity} Tons).`,
      });
      return;
    }
    onSubmit(data);
  };

  if (dataLoading) {
    return <Loader message="Fetching available fleet assets..." />;
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
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
              {v.registration_number} - {v.vehicle_name} (Max: {v.max_load_capacity}T)
            </option>
          ))}
        </select>
        {errors.vehicle_id && (
          <p className="text-xs text-red-500 mt-1">{errors.vehicle_id.message}</p>
        )}
      </div>

      {/* Driver select dropdown */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Assign Driver
        </label>
        <select
          {...register('driver_id', { valueAsNumber: true })}
          className={`
            w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
            text-slate-900 dark:text-slate-100 border transition-colors duration-150
            focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
            ${errors.driver_id ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
          `}
          disabled={loading}
        >
          <option value="">Select a driver...</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} (Safety: {d.safety_score}/100)
            </option>
          ))}
        </select>
        {errors.driver_id && (
          <p className="text-xs text-red-500 mt-1">{errors.driver_id.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Source location */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Source Location
          </label>
          <input
            type="text"
            {...register('source')}
            placeholder="e.g. Depot A"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.source ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.source && (
            <p className="text-xs text-red-500 mt-1">{errors.source.message}</p>
          )}
        </div>

        {/* Destination location */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Destination Location
          </label>
          <input
            type="text"
            {...register('destination')}
            placeholder="e.g. Warehouse B"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.destination ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.destination && (
            <p className="text-xs text-red-500 mt-1">{errors.destination.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Cargo weight */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Cargo Weight (Tons)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('cargo_weight', { valueAsNumber: true })}
            placeholder="0.00"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.cargo_weight ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.cargo_weight && (
            <p className="text-xs text-red-500 mt-1">{errors.cargo_weight.message}</p>
          )}
        </div>

        {/* Planned distance */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Planned Distance (km)
          </label>
          <input
            type="number"
            {...register('planned_distance', { valueAsNumber: true })}
            placeholder="0"
            className={`
              w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-700
              text-slate-900 dark:text-slate-100 border transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
              ${errors.planned_distance ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600'}
            `}
            disabled={loading}
          />
          {errors.planned_distance && (
            <p className="text-xs text-red-500 mt-1">{errors.planned_distance.message}</p>
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
