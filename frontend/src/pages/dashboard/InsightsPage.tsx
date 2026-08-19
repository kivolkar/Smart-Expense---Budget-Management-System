import { Lightbulb, Info } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { insightsService } from '../../services/insightsService';
import InsightAlert from '../../components/ui/InsightAlert';

export default function InsightsPage() {
  const { data: insights, loading } = useFetch(insightsService.getAll);

  return (
    <div className="page-container animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Lightbulb className="text-warning w-7 h-7" />
            AI Insights Center
          </h1>
          <p className="page-subtitle mt-1">Algorithmic analysis of your financial behavior.</p>
        </div>
      </div>

      <div className="card space-y-6">
        
        <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-text-muted">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p>
            The prediction engine continuously analyzes your transactions, categorizes run-rates, and compares your monthly burns against historical averages to proactively identify leaks before your budgets break.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">Active Alerts</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}
            </div>
          ) : !insights?.length ? (
            <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl">
              <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8 text-text-muted opacity-50" />
              </div>
              <h3 className="font-semibold text-text-primary text-lg">No alerts triggered</h3>
              <p className="text-text-muted text-sm mt-1 max-w-sm">Your cash flow is heavily stabilized. The algorithm hasn't detected any critical deviations.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {insights.map((insight, idx) => (
                <InsightAlert key={idx} insight={insight} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
