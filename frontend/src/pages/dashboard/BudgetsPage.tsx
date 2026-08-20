import { useState } from 'react';
import { Plus, Wallet, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { budgetService } from '../../services/budgetService';
import { useFetch } from '../../hooks/useFetch';
import type { Budget } from '../../types';
import BudgetModal from '../../components/budgets/BudgetModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { formatCurrency } from '../../lib/utils';

export default function BudgetsPage() {
  const { data: budgets, loading, refetch } = useFetch(budgetService.getAll);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const openCreate = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const openEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  // Delete State
  const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

  const requestDelete = (id: string) => {
    setBudgetToDelete(id);
  };

  const confirmDelete = async () => {
    if (!budgetToDelete) return;
    try {
      await budgetService.delete(budgetToDelete);
      toast.success('Budget removed');
      refetch();
    } catch (err) {
    } finally {
      setBudgetToDelete(null);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-danger';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-accent';
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Hardware Limits</h1>
          <p className="page-subtitle mt-1">Set absolute caps on categorical spending logic.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-glow">
          <Plus className="w-5 h-5" />
          Set Budget Limit
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="grid lg:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-40 skeleton rounded-xl" />)}
          </div>
        ) : !budgets?.length ? (
          <div className="py-16 text-center text-text-muted bg-background rounded-xl border border-dashed border-border flex flex-col items-center">
            <Wallet className="w-10 h-10 mb-3 opacity-30" />
            <h3 className="text-lg font-medium text-text-primary">No budgets set</h3>
            <p>Restrict your spending leaks by creating categorical budgets.</p>
            <button onClick={openCreate} className="text-primary hover:underline mt-2 text-sm">Create Budget</button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {budgets.map((budget) => {
              const pColor = getProgressColor(budget.percentageUsed);
              const isOver = budget.isExceeded;

              return (
                <div key={budget._id} className={`p-5 rounded-xl border ${isOver ? 'border-danger/40 bg-danger/5' : 'border-border bg-background'} flex flex-col relative group transition-all hover:border-primary/50`}>
                  
                  {/* Top: Category & Actions */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm border border-black/20" style={{ backgroundColor: budget.category.color || '#2e2e42' }}>
                        {budget.category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary text-lg">{budget.category.name}</h3>
                        {isOver ? (
                          <div className="flex items-center gap-1 text-xs text-danger font-medium mt-0.5">
                            <ShieldAlert className="w-3 h-3" /> Exceeded Limit
                          </div>
                        ) : (
                          <div className="text-xs text-text-muted mt-0.5">
                            {budget.percentageUsed.toFixed(1)}% consumed
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(budget)} className="p-1.5 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => requestDelete(budget._id)} className="p-1.5 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  {/* Math Stats */}
                  <div className="flex justify-between items-end mt-4 mb-2">
                    <div>
                      <p className="text-xs text-text-muted mb-1">Spent</p>
                      <p className={`font-mono font-bold text-xl ${isOver ? 'text-danger' : 'text-text-primary'}`}>
                        {formatCurrency(budget.spentAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-muted mb-1">Allowed</p>
                      <p className="font-mono text-sm text-text-muted">
                        of {formatCurrency(budget.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-2.5 w-full bg-surface-hover rounded-full overflow-hidden mt-1 relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${pColor}`} 
                      style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                    />
                    {isOver && (
                      <div className="absolute inset-0 bg-danger/20 animate-pulse" />
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BudgetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        editingBudget={editingBudget}
      />

      <ConfirmModal
        isOpen={!!budgetToDelete}
        onClose={() => setBudgetToDelete(null)}
        onConfirm={confirmDelete}
        title="Remove Budget"
        message="Are you sure you want to completely remove this budget cap? Past transactions will remain untouched, but active limit tracking will stop."
        confirmText="Remove Budget"
      />
    </div>
  );
}
