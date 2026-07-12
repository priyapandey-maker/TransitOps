import * as driverRepo from '../repositories/driver.repository';
import { ConflictError, NotFoundError } from '../utils/errors';

export const createDriver = async (data: driverRepo.DriverRow) => {
  const existingLicense = await driverRepo.findByLicense(data.license_number);
  if (existingLicense) {
    throw new ConflictError(`Driver with license ${data.license_number} already exists`);
  }

  const existingPhone = await driverRepo.findByPhone(data.phone);
  if (existingPhone) {
    throw new ConflictError(`Driver with phone ${data.phone} already exists`);
  }

  const result = await driverRepo.create(data);
  return { id: result.insertId, ...data };
};

export const listDrivers = async (limit: number, offset: number) => {
  const drivers = await driverRepo.findAll(limit, offset);
  return drivers;
};

export const getDriver = async (id: number) => {
  const driver = await driverRepo.findById(id);
  if (!driver) {
    throw new NotFoundError(`Driver with ID ${id} not found`);
  }
  return driver;
};

export const updateDriver = async (id: number, data: driverRepo.DriverRow) => {
  const driver = await driverRepo.findById(id);
  if (!driver) {
    throw new NotFoundError(`Driver with ID ${id} not found`);
  }

  if (data.license_number !== driver.license_number) {
    const existing = await driverRepo.findByLicense(data.license_number);
    if (existing) {
      throw new ConflictError(`Driver with license ${data.license_number} already exists`);
    }
  }

  if (data.phone !== driver.phone) {
    const existing = await driverRepo.findByPhone(data.phone);
    if (existing) {
      throw new ConflictError(`Driver with phone ${data.phone} already exists`);
    }
  }

  await driverRepo.update(id, data);
  return { id, ...data };
};

export const updateStatus = async (id: number, status: 'Available' | 'On Trip' | 'Inactive') => {
  const driver = await driverRepo.findById(id);
  if (!driver) {
    throw new NotFoundError(`Driver with ID ${id} not found`);
  }
  await driverRepo.updateStatus(id, status);
  return { id, status };
};
