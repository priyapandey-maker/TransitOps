import * as vehicleRepo from '../repositories/vehicle.repository';
import { ConflictError, NotFoundError } from '../utils/errors';

export const createVehicle = async (data: vehicleRepo.VehicleRow) => {
  const existing = await vehicleRepo.findByRegistration(data.registration_number);
  if (existing) {
    throw new ConflictError(`Vehicle with registration ${data.registration_number} already exists`);
  }
  const result = await vehicleRepo.create(data);
  return { id: result.insertId, ...data };
};

export const listVehicles = async (limit: number, offset: number) => {
  const vehicles = await vehicleRepo.findAll(limit, offset);
  return vehicles;
};

export const getVehicle = async (id: number) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${id} not found`);
  }
  return vehicle;
};

export const updateVehicle = async (id: number, data: vehicleRepo.VehicleRow) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${id} not found`);
  }

  if (data.registration_number !== vehicle.registration_number) {
    const existing = await vehicleRepo.findByRegistration(data.registration_number);
    if (existing) {
      throw new ConflictError(`Vehicle with registration ${data.registration_number} already exists`);
    }
  }

  await vehicleRepo.update(id, data);
  return { id, ...data };
};

export const updateStatus = async (id: number, status: 'Available' | 'On Trip' | 'In Shop' | 'Retired') => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) {
    throw new NotFoundError(`Vehicle with ID ${id} not found`);
  }
  await vehicleRepo.updateStatus(id, status);
  return { id, status };
};
