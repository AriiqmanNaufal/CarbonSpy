import ProductAnalysis, { IProductAnalysis } from '../models/ProductAnalysis';
import { Types } from 'mongoose';

interface PaginatedAnalysisResult {
  data: IProductAnalysis[];
  total: number;
  page: number;
  limit: number;
}

export const getAnalysisByScanId = async (
  scanId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedAnalysisResult> => {
  if (!Types.ObjectId.isValid(scanId)) {
    throw new Error('Invalid Scan ID');
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    ProductAnalysis.find({ scan: new Types.ObjectId(scanId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    ProductAnalysis.countDocuments({ scan: new Types.ObjectId(scanId) }),
  ]);

  return {
    data,
    total,
    page,
    limit,
  };
};
