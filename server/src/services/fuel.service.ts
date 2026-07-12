import * as fuelRepo from '../repositories/fuel.repository';
import * as vehicleRepo from '../repositories/vehicle.repository';
import * as tripRepo from '../repositories/trip.repository';
import { NotFoundError } from '../utils/errors';

export const createFuelLog = async (data: fuelRepo.FuelRow) => {
  const vehicle = await vehicleRepo.findById(data.vehicle_id);
  if (!vehicle) throw new NotFoundError('Vehicle not found');

  if (data.trip_id) {
    const trip = await tripRepo.findById(data.trip_id);
    if (!trip) throw new NotFoundError('Trip not found');
  }

  const result = await fuelRepo.create(data);
  return { id: result.insertId, ...data };
};

export const listFuelLogs = async (limit: number, offset: number) => {
  return fuelRepo.findAll(limit, offset);
};

export const getFuelLog = async (id: number) => {
  const log = await fuelRepo.findById(id);
  if (!log) throw new NotFoundError('Fuel log not found');
  return log;
};
