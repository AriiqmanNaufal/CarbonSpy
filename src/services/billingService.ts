import User, { IUser } from '../models/User';

export const getUsage = async (userId: string): Promise<{ plan: string; weeklyCredits: number }> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    plan: user.plan,
    weeklyCredits: user.weeklyCredits,
  };
};

export const updatePlan = async (userId: string, newPlan: 'free' | 'pro'): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.plan = newPlan;
  // Reset credits when changing plans
  user.weeklyCredits = newPlan === 'pro' ? 9999 : 1;

  await user.save();
  return user;
};
