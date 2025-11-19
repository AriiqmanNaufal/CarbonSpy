import { Request, Response } from 'express';
import { scrapeQueue } from '../jobs/scrapeJob';
import Scan from '../models/Scan';
import User from '../models/User';
import { z } from 'zod';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const startScanSchema = z.object({
  url: z.string().url(),
});

export const startScan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url } = startScanSchema.parse(req.body);

    const scan = new Scan({
      user: req.user!.id,
      url,
      status: 'pending',
      jobId: '', // Will be set after the job is added
    });

    const job = await scrapeQueue.add('scrape', { url, scanId: scan.id });
    scan.jobId = job.id as string;
    await scan.save();

    // Decrement weekly credits for free users
    const user = await User.findById(req.user!.id);
    if (user && user.plan === 'free') {
      user.weeklyCredits -= 1;
      await user.save();
    }

    res.status(202).json({ message: 'Scan job started', scanId: scan.id, jobId: job.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to start scan job' });
  }
};

export const getScanStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await scrapeQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const scan = await Scan.findOne({ jobId });

    res.json({
      jobId: job.id,
      status: await job.getState(),
      progress: job.progress,
      scanStatus: scan ? scan.status : 'unknown',
      scanId: scan ? scan.id : null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get job status' });
  }
};
