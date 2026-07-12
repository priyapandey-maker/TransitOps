import * as maintRepo from '../repositories/maintenance.repository';
import * as vehicleRepo from '../repositories/vehicle.repository';
import { executeTransaction } from '../repositories/base.repository';
import { BadRequestError, NotFoundError, ConflictError } from '../utils/errors';

export const createMaintenance = async (data: maintRepo.MaintenanceRow) => {
  return executeTransaction(async (conn) => {
    const vehicle = await vehicleRepo.findById(data.vehicle_id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');

    const openRecord = await maintRepo.findOpenByVehicleId(data.vehicle_id);
    if (openRecord) throw new ConflictError('Vehicle already has an OPEN maintenance record');

    data.status = 'Open';
    const result = await maintRepo.create(data, conn);
    await vehicleRepo.updateStatus(data.vehicle_id, 'In Shop', conn);

    return { id: result.insertId, ...data };
  });
};

export const listMaintenance = async (limit: number, offset: number) => {
  return maintRepo.findAll(limit, offset);
};

export const getMaintenance = async (id: number) => {
  const maint = await maintRepo.findById(id);
  if (!maint) throw new NotFoundError('Maintenance record not found');
  return maint;
};

export const closeMaintenance = async (id: number) => {
  return executeTransaction(async (conn) => {
    const maint = await maintRepo.findById(id);
    if (!maint) throw new NotFoundError('Maintenance record not found');
    if (maint.status !== 'Open') throw new BadRequestError('Maintenance record is not Open');

    const today = new Date().toISOString().split('T')[0];
    await maintRepo.updateStatusAndEndDate(id, 'Closed', today, conn);
    await vehicleRepo.updateStatus(maint.vehicle_id, 'Available', conn);

    return { id, status: 'Closed', end_date: today };
  });
};
