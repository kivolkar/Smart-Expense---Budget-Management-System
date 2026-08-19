import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth } from './hooks/useAuth';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import type { ReactNode } from 'react';

// Page placeholders — will be replaced in Phase 5-8
const TransactionsPage = () => <div className="page-container animate-fade-in"><h1 className="page-title">Transactions</h1><p className="page-subtitle mt-1">Track your spending</p></div>;
const CategoriesPage = () => <div className="page-container animate-fade-in"><h1 className="page-title">Categories</h1><p className="page-subtitle mt-1">Organize your finances</p></div>;
const BudgetsPage = () => <div className="page-container animate-fade-in"><h1 className="page-title">Budgets</h1><p className="page-subtitle mt-1">Set spending limits</p></div>;
const SavingsGoalsPage = () => <div className="page-container animate-fade-in"><h1 className="page-title">Savings Goals</h1><p className="page-subtitle mt-1">Track your targets</p></div>;
const AnalyticsPage = () => <div className="page-container animate-fade-in"><h1 className="page-title">Analytics</h1><p className="page-subtitle mt-1">Visualize your data</p></div>;
const InsightsPage = () => <div className="page-container animate-fade-in"><h1 className="page-title">Insights</h1><p className="page-subtitle mt-1">Smart recommendations</p></div>;

// Auth guard — redirects unauthenticated users to login
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Guest guard — redirects authenticated users to dashboard
function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Protected dashboard routes — DashboardLayout uses <Outlet /> */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/savings-goals" element={<SavingsGoalsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e2e',
              color: '#e2e8f0',
              border: '1px solid #2e2e42',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1e1e2e' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1e1e2e' },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
