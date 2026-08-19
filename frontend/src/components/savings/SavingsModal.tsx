import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { savingGoalService } from '../../services/savingGoalService';
import type { SavingGoal } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingGoal?: SavingGoal | null;
}

export default function SavingsModal({ isOpen, onClose, onSuccess, editingGoal }: Props) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0'); // You can seed savings
  const [targetDate, setTargetDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setTargetAmount(editingGoal.targetAmount.toString());
      setCurrentAmount(editingGoal.currentAmount.toString());
      setTargetDate(new Date(editingGoal.targetDate).toISOString().split('T')[0]);
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate(new Date(new Date().getFullYear(), new Date().getMonth() + 6, 1).toISOString().split('T')[0]);
    }
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return toast.error('Missing required fields');

    try {
      setIsSubmitting(true);
      const payload = {
        name,
        targetAmount: Number(targetAmount),
        currentAmount: Number(currentAmount),
        targetDate,
        status: 'active' as const
      };

      if (editingGoal) {
        // Exclude currentAmount on standard edit to prevent accidental overwrites vs deposit
        await savingGoalService.update(editingGoal._id, {
          name, targetAmount: Number(targetAmount), targetDate, status: editingGoal.status
        });
        toast.success('Goal updated');
      } else {
        await savingGoalService.create(payload);
        toast.success('Savings target locked in');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface/50">
          <h2 className="text-lg font-bold text-text-primary">
            {editingGoal ? 'Edit Goal Parameters' : 'New Savings Target'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Goal Name</label>
            <input type="text" className="input-field" placeholder="e.g. New Macbook Pro" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Target Amount</label>
              <input type="number" step="0.01" className="input-field font-mono" placeholder="1000.00" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} required />
            </div>
            
            {!editingGoal && (
              <div>
                <label className="label">Start Amount</label>
                <input type="number" step="0.01" className="input-field font-mono bg-background" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} />
              </div>
            )}
          </div>

          <div>
            <label className="label">Target Deadline</label>
            <input type="date" className="input-field text-sm" value={targetDate} onChange={e => setTargetDate(e.target.value)} required />
            <p className="text-xs text-text-muted mt-1 leading-relaxed">Our prediction engine uses this to calculate required daily savings velocity.</p>
          </div>
        </form>

        <div className="p-4 border-t border-border bg-surface/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg font-semibold border border-border text-text-primary hover:bg-surface-hover">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 btn-primary flex justify-center items-center gap-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set Target'}
          </button>
        </div>
      </div>
    </div>
  );
}
