import { create } from 'zustand';
import { User } from '@/types/User';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true, // Initially true to check for an active session
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useUserStore;
