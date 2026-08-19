import { AlertTriangle, TrendingUp, ShieldAlert } from 'lucide-react';
import type { Insight } from '../../types';

interface Props {
  insight: Insight;
}

export default function InsightAlert({ insight }: Props) {
  const isWarning = insight.type === 'warning';
  const isSuccess = insight.type === 'success';
  const isAlert = insight.type === 'alert';

  // Dynamic Tailwind mapping based on insight mathematical severity
  const bgColor = isSuccess ? 'bg-accent/10' : isWarning ? 'bg-warning/10' : 'bg-danger/10';
  const borderColor = isSuccess ? 'border-accent/20' : isWarning ? 'border-warning/20' : 'border-danger/20';
  const iconColor = isSuccess ? 'text-accent' : isWarning ? 'text-warning' : 'text-danger';

  let Icon = TrendingUp;
  if (isWarning) Icon = AlertTriangle;
  if (isAlert) Icon = ShieldAlert;

  return (
    <div className={`p-4 rounded-lg flex gap-4 items-start border ${bgColor} ${borderColor} hover:bg-opacity-80 transition-colors cursor-pointer shrink-0 w-[280px] md:w-full`}>
      <div className={`mt-0.5 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-semibold text-text-primary text-sm mb-1">{insight.title}</h4>
        <p className="text-xs text-text-muted leading-relaxed hidden md:block">{insight.message}</p>
        {/* On mobile, aggressively truncate message to save UI height inside horizontal carousels */}
        <p className="text-xs text-text-muted leading-relaxed md:hidden line-clamp-2">{insight.message}</p>
      </div>
    </div>
  );
}
