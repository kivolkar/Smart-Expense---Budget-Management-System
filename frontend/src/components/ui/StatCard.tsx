import { type LucideIcon } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  colorClass: string;
}

export default function StatCard({ title, amount, icon: Icon, colorClass }: StatCardProps) {
  return (
    <div className="card-hover flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-sm font-medium">{title}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${colorClass}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div>
        <h3 className="stat-value">{formatCurrency(amount)}</h3>
      </div>
    </div>
  );
}
