import { create } from 'zustand';
import { Scan } from '@/types/Scan';
import { Product } from '@/types/Product';

interface ScanState {
  jobId: string | null;
  scanId: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | null;
  results: Product[] | null;
  setJob: (jobId: string, scanId: string) => void;
  setStatus: (status: 'pending' | 'processing' | 'completed' | 'failed') => void;
  setResults: (results: Product[]) => void;
  resetScan: () => void;
}

const useScanStore = create<ScanState>((set) => ({
  jobId: null,
  scanId: null,
  status: null,
  results: null,
  setJob: (jobId, scanId) => set({ jobId, scanId, status: 'pending' }),
  setStatus: (status) => set({ status }),
  setResults: (results) => set({ results }),
  resetScan: () => set({ jobId: null, scanId: null, status: null, results: null }),
}));

export default useScanStore;
