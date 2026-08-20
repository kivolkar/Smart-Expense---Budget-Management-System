import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { transactionService } from '../../services/transactionService';
import { categoryService } from '../../services/categoryService';
import type { Transaction, PaymentMethod } from '../../types';
import { useFetch } from '../../hooks/useFetch';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTransaction?: Transaction | null;
}

export default function TransactionModal({ isOpen, onClose, onSuccess, editingTransaction }: Props) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories to populate dropdown
  const { data: categories } = useFetch(categoryService.getAll);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description || '');
      setCategoryId(typeof editingTransaction.category === 'string' ? editingTransaction.category : editingTransaction.category?._id || '');
      setDate(new Date(editingTransaction.date).toISOString().split('T')[0]);
      setPaymentMethod(editingTransaction.paymentMethod || 'cash');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategoryId('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('cash');
      setReceipt(null);
    }
  }, [editingTransaction, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) {
      return toast.error('Please fill required fields');
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('type', type);
      formData.append('amount', amount.toString());
      formData.append('description', description);
      formData.append('category', categoryId);
      formData.append('date', date);
      formData.append('paymentMethod', paymentMethod);
      if (receipt) {
        formData.append('receipt', receipt);
      }

      if (editingTransaction) {
        await transactionService.update(editingTransaction._id, formData);
        toast.success('Transaction updated');
      } else {
        await transactionService.create(formData);
        toast.success('Transaction created');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface/50">
          <h2 className="text-lg font-bold text-text-primary">
            {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          
          {/* Type Toggle */}
          <div className="flex p-1 bg-background rounded-lg border border-border">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-danger text-white shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-accent text-white shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>

          <div>
            <label className="label">Amount (₹)</label>
            <input type="number" step="0.01" className="input-field text-xl font-bold font-mono" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>

          <div>
            <label className="label">Description</label>
            <input type="text" className="input-field" placeholder="What was this for?" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                <option value="" disabled>Select category</option>
                {categories?.filter(c => c.type === type).map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Payment Method</label>
              <select className="input-field py-2" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} required>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="label">Receipt (Optional)</label>
              <input 
                type="file" 
                accept="image/*,.pdf"
                className="input-field text-sm py-1.5" 
                onChange={e => setReceipt(e.target.files?.[0] || null)} 
              />
            </div>
          </div>

        </form>

        <div className="p-4 border-t border-border bg-surface/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg font-semibold border border-border text-text-primary hover:bg-surface-hover">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 btn-primary flex justify-center items-center gap-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
