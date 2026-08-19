import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCategory?: Category | null;
}

const DEFAULT_COLOR = '#8b5cf6'; // Violet

export default function CategoryModal({ isOpen, onClose, onSuccess, editingCategory }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [icon, setIcon] = useState('🍔');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setType(editingCategory.type);
      setIcon(editingCategory.icon || '🍔');
      setColor(editingCategory.color || DEFAULT_COLOR);
    } else {
      setName('');
      setType('expense');
      setIcon('🍔');
      setColor(DEFAULT_COLOR);
    }
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error('Category name is required');

    try {
      setIsSubmitting(true);
      const payload = { name, type, icon, color };

      if (editingCategory) {
        await categoryService.update(editingCategory._id, payload);
        toast.success('Category updated');
      } else {
        await categoryService.create(payload);
        toast.success('Category created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      // Let axios interceptor handle toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface/50">
          <h2 className="text-lg font-bold text-text-primary">
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          
          <div className="flex p-1 bg-background rounded-lg border border-border">
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-danger text-white shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-accent text-white shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>

          <div>
            <label className="label">Category Name</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Groceries" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Icon (Emoji)</label>
              <input 
                type="text" 
                maxLength={3} // Emojis can technically be multiple chars due to variation selectors
                className="input-field text-center text-xl" 
                placeholder="🛒" 
                value={icon} 
                onChange={e => setIcon(e.target.value)} 
              />
            </div>
            <div>
              <label className="label">Color theme</label>
              <input 
                type="color" 
                className="w-full h-[42px] cursor-pointer rounded-lg border-2 border-border bg-background p-1" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-surface/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg font-semibold border border-border text-text-primary hover:bg-surface-hover transition-colors">
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
