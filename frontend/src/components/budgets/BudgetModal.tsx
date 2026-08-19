import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { budgetService } from '../../services/budgetService';
import { categoryService } from '../../services/categoryService';
import { useFetch } from '../../hooks/useFetch';
import type { Budget } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingBudget?: Budget | null;
}

export default function BudgetModal({ isOpen, onClose, onSuccess, editingBudget }: Props) {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch only Expense categories since budgets only apply to spending
  const { data: categories } = useFetch(categoryService.getAll);
  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];

  useEffect(() => {
    if (editingBudget) {
      setCategoryId(editingBudget.category._id);
      setAmount(editingBudget.amount.toString());
      setStartDate(new Date(editingBudget.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(editingBudget.endDate).toISOString().split('T')[0]);
    } else {
      setCategoryId('');
      setAmount('');
      setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
      setEndDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);
    }
  }, [editingBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return toast.error('Missing required fields');

    try {
      setIsSubmitting(true);
      const payload = {
        category: categoryId as any,
        amount: Number(amount),
        startDate,
        endDate
      };

      if (editingBudget) {
        await budgetService.update(editingBudget._id, payload);
        toast.success('Budget updated limit');
      } else {
        await budgetService.create(payload);
        toast.success('Budget established');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      // Handled by interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface/50">
          <h2 className="text-lg font-bold text-text-primary">
            {editingBudget ? 'Edit Budget' : 'Set Budget'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Expense Category</label>
            <select className="input-field" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
              <option value="" disabled>Select category to limit</option>
              {expenseCategories.map(c => (
                <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
              ))}
            </select>
            <p className="text-xs text-text-muted mt-1">We track all transactions mapping to this category against this budget.</p>
          </div>

          <div>
            <label className="label">Budget Limit Amount</label>
            <input type="number" step="0.01" className="input-field font-mono text-lg" placeholder="1000.00" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input type="date" className="input-field text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" className="input-field text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-border bg-surface/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg font-semibold border border-border text-text-primary hover:bg-surface-hover">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 btn-primary flex justify-center items-center gap-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Limit'}
          </button>
        </div>
      </div>
    </div>
  );
}
