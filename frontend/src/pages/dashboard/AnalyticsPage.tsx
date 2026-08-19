import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { PieChart as PieIcon, TrendingUp, HelpCircle } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { analyticsService } from '../../services/analyticsService';
import { formatCurrency } from '../../lib/utils';

export default function AnalyticsPage() {
  const { data: categoryData, loading: catLoading } = useFetch(analyticsService.getCategoryComparison);
  const { data: yearlyData, loading: yearlyLoading } = useFetch(analyticsService.getYearlyTrend);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface/90 backdrop-blur border border-border p-3 rounded-lg shadow-xl">
          <p className="text-text-primary font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface/90 backdrop-blur border border-border p-3 rounded-lg shadow-xl">
          <p className="text-text-primary font-semibold flex items-center gap-2">
            <span>{data.icon}</span> {data.category}
          </p>
          <p className="text-sm font-medium mt-1 text-text-muted">
            Total: <span className="text-primary">{formatCurrency(data.totalAmount)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Analytics Engine</h1>
        <p className="page-subtitle mt-1">Deep visual crunching of your historical data.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="card flex flex-col min-h-[450px]">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Expense Distribution</h2>
          </div>
          
          {catLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full skeleton" />
            </div>
          ) : !categoryData?.length ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
              <HelpCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>No categorical data mapped yet.</p>
            </div>
          ) : (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={5}
                    dataKey="totalAmount"
                    nameKey="category"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#8b5cf6'} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value, entry: any) => (
                      <span className="text-sm text-text-muted">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Yearly Macro Trend */}
        <div className="card flex flex-col min-h-[450px]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold text-text-primary">Macro Yearly Trend</h2>
          </div>

          {yearlyLoading ? (
            <div className="flex-1 flex items-end gap-4 p-4">
               {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 skeleton rounded-t-sm" style={{ height: `${Math.random() * 80 + 20}%` }} />)}
            </div>
          ) : !yearlyData?.length ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
              <HelpCircle className="w-12 h-12 mb-3 opacity-20" />
              <p>Not enough historical data.</p>
            </div>
          ) : (
             <div className="flex-1">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={yearlyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e42" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    stroke="#8A8A9E" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#8A8A9E" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#2e2e42', opacity: 0.4 }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
