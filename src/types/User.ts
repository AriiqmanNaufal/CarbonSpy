export interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro';
  weeklyCredits: number;
  createdAt: string;
}
