import * as tripRepo from '../repositories/trip.repository';
import * as vehicleRepo from '../repositories/vehicle.repository';
import * as driverRepo from '../repositories/driver.repository';
import { executeTransaction } from '../repositories/base.repository';
import { BadRequestError, NotFoundError } from '../utils/errors';

export const createTrip = async (data: tripRepo.TripRow) => {
  const vehicle = await vehicleRepo.findById(data.vehicle_id);
  if (!vehicle) throw new NotFoundError('Vehicle not found');
  if (vehicle.status !== 'Available') throw new BadRequestError('Vehicle is not available');

  const driver = await driverRepo.findById(data.driver_id);
  if (!driver) throw new NotFoundError('Driver not found');
  if (driver.status !== 'Available') throw new BadRequestError('Driver is not available');

  data.status = 'Draft';
  const result = await tripRepo.create(data);
  return { id: result.insertId, ...data };
};

export const listTrips = async (limit: number, offset: number) => {
  return tripRepo.findAll(limit, offset);
};

export const getTrip = async (id: number) => {
  const trip = await tripRepo.findById(id);
  if (!trip) throw new NotFoundError('Trip not found');
  return trip;
};

export const dispatchTrip = async (id: number, userId: number) => {
  return executeTransaction(async (conn) => {
    const trip = await tripRepo.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');
    if (trip.status !== 'Draft') throw new BadRequestError('Only Draft trips can be dispatched');

    const vehicle = await vehicleRepo.findById(trip.vehicle_id);
    if (!vehicle || vehicle.status !== 'Available') throw new BadRequestError('Vehicle is not available for dispatch');

    const driver = await driverRepo.findById(trip.driver_id);
    if (!driver || driver.status !== 'Available') throw new BadRequestError('Driver is not available for dispatch');

    await tripRepo.updateStatus(id, 'Dispatched', conn);
    await vehicleRepo.updateStatus(trip.vehicle_id, 'On Trip', conn);
    await driverRepo.updateStatus(trip.driver_id, 'On Trip', conn);
    await tripRepo.insertHistory(id, 'Draft', 'Dispatched', userId, conn);

    return { id, status: 'Dispatched' };
  });
};

export const completeTrip = async (id: number, userId: number) => {
  return executeTransaction(async (conn) => {
    const trip = await tripRepo.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');
    if (trip.status !== 'Dispatched') throw new BadRequestError('Only Dispatched trips can be completed');

    await tripRepo.updateStatus(id, 'Completed', conn);
    await vehicleRepo.updateStatus(trip.vehicle_id, 'Available', conn);
    await driverRepo.updateStatus(trip.driver_id, 'Available', conn);
    await tripRepo.insertHistory(id, 'Dispatched', 'Completed', userId, conn);

    return { id, status: 'Completed' };
  });
};

export const cancelTrip = async (id: number, userId: number) => {
  return executeTransaction(async (conn) => {
    const trip = await tripRepo.findById(id);
    if (!trip) throw new NotFoundError('Trip not found');
    if (trip.status !== 'Draft' && trip.status !== 'Dispatched') {
      throw new BadRequestError('Only Draft or Dispatched trips can be cancelled');
    }

    await tripRepo.updateStatus(id, 'Cancelled', conn);
    await vehicleRepo.updateStatus(trip.vehicle_id, 'Available', conn);
    await driverRepo.updateStatus(trip.driver_id, 'Available', conn);
    await tripRepo.insertHistory(id, trip.status, 'Cancelled', userId, conn);

    return { id, status: 'Cancelled' };
  });
};
