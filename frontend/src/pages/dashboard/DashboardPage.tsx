import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import MonthlyOverviewChart from '../../components/charts/MonthlyOverviewChart';
import InsightAlert from '../../components/ui/InsightAlert';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';
import { insightsService } from '../../services/insightsService';

export default function DashboardPage() {
  // Fetch dashboard UI aggregations and predictive insights simultaneously
  const { data: dashboardData, loading: dashboardLoading, error } = useFetch(dashboardService.getData);
  const { data: insightsData, loading: insightsLoading } = useFetch(insightsService.getAll);

  // Skeleton loading state
  if (dashboardLoading) {
    return (
      <div className="page-container animate-fade-in space-y-6">
        <div className="h-8 w-48 skeleton mb-6" />
        <div className="grid-stats">
          {[1,2,3,4].map(i => <div key={i} className="h-28 skeleton" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 h-[400px] skeleton rounded-lg" />
          <div className="h-[400px] skeleton rounded-lg" />
        </div>
      </div>
    );
  }

  // Error boundary
  if (error || !dashboardData) {
    return (
      <div className="page-container">
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger">
          Failed to load dashboard data. Ensure the backend server is running.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Financial Overview</h1>
        <p className="page-subtitle mt-1">Here is what is happening with your money.</p>
      </div>

      {/* Math KPI Grid */}
      <div className="grid-stats">
        <StatCard 
          title="Total Balance" 
          amount={dashboardData.currentBalance || 0} 
          icon={Wallet} 
          colorClass="bg-primary" 
        />
        <StatCard 
          title="Income (MTD)" 
          amount={dashboardData.totalIncome || 0} 
          icon={TrendingUp} 
          colorClass="bg-accent" 
        />
        <StatCard 
          title="Expense (MTD)" 
          amount={dashboardData.totalExpense || 0} 
          icon={TrendingDown} 
          colorClass="bg-danger" 
        />
        <StatCard 
          title="Total Savings" 
          amount={dashboardData.totalSavings || 0} 
          icon={Target} 
          colorClass="bg-[#3b82f6]" // custom blue 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Left Column — Charts */}
        <div className="lg:col-span-2 card flex flex-col">
          <h2 className="text-lg font-bold text-text-primary mb-2">Cashflow Trend</h2>
          <MonthlyOverviewChart data={dashboardData.monthlyOverview || []} />
        </div>

        {/* Right Column — Insights Algorithm Feed */}
        <div className="card flex flex-col">
          <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            Smart Insights 
            {insightsData && insightsData.length > 0 && !insightsLoading && (
              <span className="badge-warning">{insightsData.length}</span>
            )}
          </h2>
          
          {/* 
            Mobile-Responsive Overflow Container:
            On mobile this becomes a horizontal swipeable carousel.
            On desktop it becomes a vertical scrollable sidebar column.
          */}
          <div className="flex-1 overflow-x-auto md:overflow-x-hidden md:overflow-y-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex md:flex-col gap-3">
              {insightsLoading ? (
                // Skeletons
                [1,2,3].map(i => <div key={i} className="h-24 skeleton w-[280px] md:w-full shrink-0" />)
              ) : insightsData?.length ? (
                // Data Array
                insightsData.map((insight, idx) => (
                  <InsightAlert key={idx} insight={insight} />
                ))
              ) : (
                // Empty state if algorithms detect no budget leakage
                <div className="text-text-muted text-sm flex w-full h-32 items-center justify-center bg-surface-hover rounded-lg border border-border">
                  Perfectly on budget. No leaks detected!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
