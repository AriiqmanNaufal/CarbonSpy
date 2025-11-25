export interface Scan {
  id: string;
  user: string; // User ID
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string;
  createdAt: string;
}
