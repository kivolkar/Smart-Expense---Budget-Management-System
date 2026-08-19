import type { Category } from './category';

export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'upi' | 'bank_transfer';

export interface Transaction {
  _id: string;
  user: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  category?: string;
  type?: 'income' | 'expense';
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'amount_high' | 'amount_low';
  page?: number;
  limit?: number;
}

export interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
