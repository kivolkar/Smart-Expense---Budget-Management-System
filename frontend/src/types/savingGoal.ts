export interface SavingGoal {
  _id: string;
  user: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'active' | 'completed' | 'abandoned';
  remainingAmount: number;
  percentageCompleted: number;
  estimatedCompletionDate: string | null;
  averageDailySavings: number;
  createdAt: string;
  updatedAt: string;
}
