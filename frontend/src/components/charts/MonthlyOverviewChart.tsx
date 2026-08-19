import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import type { MonthlyOverview } from '../../types';
import { formatCurrency, getMonthName } from '../../lib/utils';

interface Props {
  data: MonthlyOverview[];
}

export default function MonthlyOverviewChart({ data }: Props) {
  // Map raw data into Recharts format
  const chartData = data.map(item => ({
    name: `${getMonthName(item.month)} ${item.year}`,
    Income: item.income,
    Expense: item.expense
  }));

  // Recharts responsive container breaks if parent has no defined height, 
  // so we enforce 300px min-height locally.
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e42" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          
          <Tooltip 
            cursor={{ fill: '#2a2a3d' }}
            contentStyle={{ backgroundColor: '#1e1e2e', borderColor: '#2e2e42', borderRadius: '0.75rem' }}
            itemStyle={{ fontSize: '14px', fontWeight: 500 }}
            formatter={(value: number) => formatCurrency(value)}
          />
          
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
