import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shuddi_for_the_win';

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);

export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};