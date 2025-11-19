import { Response } from 'express';
import * as billingService from '../services/billingService';
import { AuthenticatedRequest } from '../types/express';
import { z } from 'zod';

const updatePlanSchema = z.object({
  plan: z.enum(['free', 'pro']),
});

export const getUsage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const usage = await billingService.getUsage(req.user!.id);
    res.json(usage);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const updatePlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { plan } = updatePlanSchema.parse(req.body);
    const user = await billingService.updatePlan(req.user!.id, plan);
    res.json({ message: 'Plan updated successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(404).json({ message: (error as Error).message });
  }
};
