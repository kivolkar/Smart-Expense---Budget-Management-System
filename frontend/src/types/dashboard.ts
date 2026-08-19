export interface MonthlyOverview {
  year: number;
  month: number;
  income: number;
  expense: number;
}

export interface DashboardData {
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  monthlyOverview: MonthlyOverview[];
}
