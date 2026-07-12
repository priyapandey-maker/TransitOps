import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import * as userRepository from '../repositories/user.repository';
import { UnauthorizedError, NotFoundError } from '../utils/errors';

export const login = async (email: string, passwordPlain: string) => {
  const user = await userRepository.findByEmail(email);
  
  if (!user || user.status !== 'Active') {
    throw new UnauthorizedError('Invalid credentials or inactive account');
  }

  const isMatch = await bcrypt.compare(passwordPlain, user.password_hash);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials or inactive account');
  }

  const payload = {
    userId: user.id,
    role: user.role_name
  };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role_name
    }
  };
};

export const getProfile = async (userId: number) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role_name,
    status: user.status
  };
};
