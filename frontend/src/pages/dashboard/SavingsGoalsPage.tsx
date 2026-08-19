import { useState } from 'react';
import { Plus, Target, ArrowUpCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { savingGoalService } from '../../services/savingGoalService';
import { useFetch } from '../../hooks/useFetch';
import type { SavingGoal } from '../../types';
import SavingsModal from '../../components/savings/SavingsModal';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function SavingsGoalsPage() {
  const { data: goals, loading, refetch } = useFetch(savingGoalService.getAll);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);

  // Deposit specific logic
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const openCreate = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleDeposit = async (e: React.FormEvent, goal: SavingGoal) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) return;
    
    try {
      await savingGoalService.update(goal._id, {
        currentAmount: goal.currentAmount + Number(depositAmount),
        // If they bypass 100%, mark as completed
        status: (goal.currentAmount + Number(depositAmount)) >= goal.targetAmount ? 'completed' : 'active'
      });
      toast.success(`Deposited ${formatCurrency(Number(depositAmount))} into ${goal.name}`);
      setDepositGoalId(null);
      setDepositAmount('');
      refetch();
    } catch (err) {}
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Saving Goals</h1>
          <p className="page-subtitle mt-1">Track dedicated funds toward specific targets.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-glow">
          <Plus className="w-5 h-5" />
          Create Goal
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => <div key={i} className="h-48 skeleton rounded-xl" />)}
          </div>
        ) : !goals?.length ? (
          <div className="py-16 text-center text-text-muted bg-background rounded-xl border border-dashed border-border flex flex-col items-center">
            <Target className="w-10 h-10 mb-3 opacity-30" />
            <h3 className="text-lg font-medium text-text-primary">No saving goals</h3>
            <p>Define a financial landmark and let the prediction engine guide you.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {goals.map((goal) => {
              const isCompleted = goal.status === 'completed' || goal.percentageCompleted >= 100;

              return (
                <div key={goal._id} className="p-6 rounded-xl border border-border bg-background flex flex-col md:flex-row gap-6 relative shadow-sm hover:border-primary/50 transition-all">
                  
                  {/* Left Block — Main Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {isCompleted ? <CheckCircle2 className="text-accent w-6 h-6" /> : <Target className="text-primary w-6 h-6" />}
                        <h3 className="font-bold text-text-primary text-xl">{goal.name}</h3>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => { setEditingGoal(goal); setIsModalOpen(true); }} className="text-xs text-text-muted hover:text-primary transition-colors">Edit</button>
                      </div>
                    </div>

                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-mono font-bold text-text-primary">{formatCurrency(goal.currentAmount)}</span>
                      <span className="text-sm font-mono text-text-muted mb-1 pb-0.5">/ {formatCurrency(goal.targetAmount)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full bg-surface-hover rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-accent shadow-accent/50 shadow-[0_0_10px]' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(goal.percentageCompleted, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-text-muted font-medium">
                      <span>{goal.percentageCompleted.toFixed(1)}% Funded</span>
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  </div>

                  {/* Vertical Divider (Desktop only) */}
                  <div className="hidden md:block w-px bg-border my-2" />

                  {/* Right Block — Prediction Engine & Actions */}
                  <div className="w-full md:w-64 shrink-0 flex flex-col justify-center bg-surface-hover/30 p-4 rounded-lg border border-border/50">
                    
                    {!isCompleted ? (
                      <>
                        <div className="flex items-start gap-2 mb-4 text-xs leading-relaxed text-text-muted">
                          <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p>
                            To hit your deadline, you need to save roughly <strong className="text-primary-light"> {formatCurrency(goal.averageDailySavings)} </strong> every single day.
                          </p>
                        </div>
                        
                        {depositGoalId === goal._id ? (
                          <form onSubmit={(e) => handleDeposit(e, goal)} className="flex gap-2 animate-slide-up">
                            <input 
                              type="number" 
                              step="0.01" 
                              autoFocus
                              className="input-field text-sm py-1.5 px-2" 
                              placeholder="Amount" 
                              value={depositAmount} 
                              onChange={e => setDepositAmount(e.target.value)} 
                            />
                            <button type="submit" className="bg-primary hover:bg-primary-light text-white rounded-md px-3 text-sm font-medium transition-colors">
                              Add
                            </button>
                          </form>
                        ) : (
                          <button 
                            onClick={() => setDepositGoalId(goal._id)}
                            className="w-full py-2 bg-surface text-text-primary border border-border hover:border-primary/50 hover:bg-primary/10 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-1"
                          >
                            <ArrowUpCircle className="w-4 h-4 text-primary" />
                            Log Deposit
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex justify-center items-center">
                          <CheckCircle2 className="w-6 h-6 text-accent" />
                        </div>
                        <p className="text-sm font-bold text-accent">Goal Mastered</p>
                        <p className="text-xs text-text-muted">Target Acquired</p>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <SavingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        editingGoal={editingGoal}
      />
    </div>
  );
}
