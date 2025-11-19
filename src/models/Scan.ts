import { Schema, model, Document, Types } from 'mongoose';

export interface IScan extends Document {
  user: Types.ObjectId;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string;
  rawData?: string;
  extractedText?: { [key: string]: string };
  createdAt: Date;
  updatedAt: Date;
}

const ScanSchema = new Schema<IScan>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  jobId: { type: String, required: true },
  rawData: { type: String },
  extractedText: { type: Map, of: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ScanSchema.pre<IScan>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Scan = model<IScan>('Scan', ScanSchema);

export default Scan;
