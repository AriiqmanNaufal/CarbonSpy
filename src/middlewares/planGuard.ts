import { Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from '../types/express';

export const planGuard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.plan === 'pro') {
      return next(); // Pro users have unlimited access
    }

    // For free users, check weekly credits
    if (user.plan === 'free') {
      if (user.weeklyCredits > 0) {
        return next();
      } else {
        return res.status(429).json({ message: 'You have exceeded your weekly scan limit. Please upgrade to Pro for unlimited scans.' });
      }
    }

    // Default deny
    return res.status(403).json({ message: 'Access denied.' });

  } catch (error) {
    res.status(500).json({ message: 'Server error while checking user plan.' });
  }
};
