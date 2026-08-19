import type { Category } from './category';

export interface Budget {
  _id: string;
  user: string;
  category: Category;
  amount: number;
  startDate: string;
  endDate: string;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isExceeded: boolean;
  createdAt: string;
  updatedAt: string;
}
