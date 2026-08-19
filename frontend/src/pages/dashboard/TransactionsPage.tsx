import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { transactionService } from '../../services/transactionService';
import { useFetch } from '../../hooks/useFetch';
import { useDebounce } from '../../hooks/useDebounce';
import type { Transaction, TransactionFilters as FilterType } from '../../types';
import TransactionTable from '../../components/transactions/TransactionTable';
import TransactionFiltersBar from '../../components/transactions/TransactionFilters';
import TransactionModal from '../../components/transactions/TransactionModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterType>({ page: 1, limit: 10, sort: 'newest' });
  const debouncedSearch = useDebounce(filters.search || '', 500);

  // Memoize the API call wrapper so useFetch detects exactly when to re-fire
  const fetchFn = useCallback(() => {
    return transactionService.getAll({ 
      ...filters, 
      search: debouncedSearch || undefined 
    });
  }, [filters.page, filters.limit, filters.type, filters.sort, debouncedSearch]);

  const { data, loading, refetch } = useFetch(fetchFn, [fetchFn]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Transaction | null>(null);

  // Delete Modal State
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const requestDelete = (id: string) => {
    setTransactionToDelete(id);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await transactionService.delete(transactionToDelete);
      toast.success('Transaction permanently deleted');
      refetch();
    } catch (err) {
      // Axios interceptor handles global toast
    } finally {
      setTransactionToDelete(null);
    }
  };

  const openEdit = (tx: Transaction) => {
    setEditingData(tx);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const pagination = data?.pagination;

  return (
    <div className="page-container animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle mt-1">Manage your income and expenses.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto shadow-glow">
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Main List Container */}
      <div className="card">
        <TransactionFiltersBar filters={filters} onChange={setFilters} />
        
        <TransactionTable 
          transactions={data?.transactions || []} 
          loading={loading} 
          onEdit={openEdit} 
          onDelete={requestDelete} 
        />

        {/* Dynamic Pagination Controls */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
            <button 
              disabled={pagination.page === 1}
              onClick={() => setFilters(f => ({ ...f, page: pagination.page - 1 }))}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-text-primary hover:bg-surface-hover transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-text-muted font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button 
              disabled={pagination.page === pagination.pages}
              onClick={() => setFilters(f => ({ ...f, page: pagination.page + 1 }))}
              className="px-4 py-2 text-sm font-medium border border-border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-text-primary hover:bg-surface-hover transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Slide-over / Modal for Create/Edit */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refetch}
        editingTransaction={editingData}
      />

      {/* Danger Deletion Modal */}
      <ConfirmModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction? This action will permanently modify your analytical history and cannot be undone."
        confirmText="Delete it"
      />
    </div>
  );
}
