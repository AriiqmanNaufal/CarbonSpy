import User, { IUser } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { ZodError } from 'zod';
import { registerSchema, loginSchema } from '../utils/validation';

export const register = async (body: unknown) => {
  const { email, password } = registerSchema.parse(body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = new User({ email, password });
  await user.save();

  // Omit password from the returned user object
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

export const login = async (body: unknown) => {
  const { email, password } = loginSchema.parse(body);

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }

  const payload = { id: user.id, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, accessToken, refreshToken };
};

export const refresh = (token: string) => {
  const payload = verifyToken(token, true);
  if (!payload) {
    throw new Error('Invalid refresh token');
  }

  const newPayload = { id: payload.id, email: payload.email };
  const accessToken = generateAccessToken(newPayload);

  return { accessToken };
};

export const getMe = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId);
};
