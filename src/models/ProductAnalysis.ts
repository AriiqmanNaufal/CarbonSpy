import { Schema, model, Document, Types } from 'mongoose';

export interface IProductAnalysis extends Document {
  scan: Types.ObjectId;
  productName: string;
  material: string;
  packaging: string;
  logistics: string;
  estimatedCO2: number;
  comparisonToIndustryAvg: string;
  suggestions: string[];
  createdAt: Date;
}

const ProductAnalysisSchema = new Schema<IProductAnalysis>({
  scan: { type: Schema.Types.ObjectId, ref: 'Scan', required: true },
  productName: { type: String, required: true },
  material: { type: String, required: true },
  packaging: { type: String, required: true },
  logistics: { type: String, required: true },
  estimatedCO2: { type: Number, required: true },
  comparisonToIndustryAvg: { type: String, required: true },
  suggestions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const ProductAnalysis = model<IProductAnalysis>('ProductAnalysis', ProductAnalysisSchema);

export default ProductAnalysis;
