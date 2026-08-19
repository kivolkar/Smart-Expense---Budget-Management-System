import { useState } from 'react';
import { Plus, Tag, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';
import { useFetch } from '../../hooks/useFetch';
import type { Category } from '../../types';
import CategoryModal from '../../components/categories/CategoryModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function CategoriesPage() {
  const { data: categories, loading, refetch } = useFetch(categoryService.getAll);
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredCategories = categories?.filter(c => c.type === activeTab) || [];

  const openCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Delete State
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null);

  const requestDelete = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      toast.success(`Deleted ${categoryToDelete.name}`);
      refetch();
    } catch (err) {
      // Handled by global interceptor
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle mt-1">Organize and personalize your financial buckets.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-glow">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="card">
        {/* Animated Tabs */}
        <div className="flex gap-4 border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('expense')}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'expense' 
                ? 'border-danger text-danger' 
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Expense Categories
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'income' 
                ? 'border-accent text-accent' 
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            Income Categories
          </button>
        </div>

        {/* Grid display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-text-muted bg-background rounded-xl border border-dashed border-border flex flex-col items-center">
            <Tag className="w-8 h-8 mb-3 opacity-50" />
            <p>No {activeTab} categories found.</p>
            <button onClick={openCreate} className="text-primary hover:underline mt-2 text-sm">
              Create your first one!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map(category => (
              <div 
                key={category._id} 
                className="group relative p-4 rounded-xl border border-border bg-background hover:bg-surface-hover/50 hover:border-primary/50 transition-all flex items-center gap-3"
              >
                {/* Visual Indicator */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shadow-sm border border-black/20"
                  style={{ backgroundColor: category.color || '#2e2e42' }}
                  title={category.name}
                >
                  {category.icon ? category.icon : <Tag className="w-5 h-5 text-white" />}
                </div>

                <div className="flex-1 overflow-hidden">
                  <h3 className="font-semibold text-text-primary truncate">{category.name}</h3>
                </div>

                {/* Absolute overlay for actions on hover */}
                <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-background/90 backdrop-blur pl-2 rounded-l-lg py-1">
                  <button onClick={() => openEdit(category)} className="p-1.5 text-text-muted hover:text-primary bg-surface rounded-md">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => requestDelete(category._id, category.name)} className="p-1.5 text-text-muted hover:text-danger bg-surface rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        editingCategory={editingCategory}
      />

      <ConfirmModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete the "${categoryToDelete?.name}" category? Transactions bound to this category may behave unexpectedly in analytics.`}
        confirmText="Delete Category"
      />
    </div>
  );
}
