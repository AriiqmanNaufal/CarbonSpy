import { Request, Response } from 'express';
import * as productService from '../services/productService';
import { z } from 'zod';

const getAnalysisSchema = z.object({
  scanId: z.string(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('10').transform(Number),
});

export const getAnalysisResults = async (req: Request, res: Response) => {
  try {
    const { scanId, page, limit } = getAnalysisSchema.parse({
      scanId: req.params.scanId,
      page: req.query.page,
      limit: req.query.limit,
    });

    const results = await productService.getAnalysisByScanId(scanId, page, limit);
    res.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    if ((error as Error).message === 'Invalid Scan ID') {
      return res.status(400).json({ message: 'Invalid Scan ID' });
    }
    res.status(500).json({ message: 'Failed to get analysis results' });
  }
};
