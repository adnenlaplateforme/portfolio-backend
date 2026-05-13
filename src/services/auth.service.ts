import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model.js';
import AppError from '../errors/AppError.js';

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const user = await UserModel.findByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid credentials', 401);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' },
  );

  return token;
};
