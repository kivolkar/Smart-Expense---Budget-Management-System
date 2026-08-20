import { Search, X } from 'lucide-react';
import type { TransactionFilters } from '../../types';

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export default function TransactionFiltersBar({ filters, onChange }: Props) {
  const handleChange = (key: keyof TransactionFilters, value: any) => {
    onChange({ ...filters, [key]: value, page: 1 }); // reset to page 1 on filter
  };

  const clearFilters = () => {
    onChange({ page: 1, limit: 10, search: '', type: undefined, sort: 'newest' });
  };

  const hasActiveFilters = filters.search || filters.type || filters.sort !== 'newest';

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Search by description..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      {/* Filters container */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0">
        <select
          className="input-field w-auto py-2 px-3 text-sm"
          value={filters.type || ''}
          onChange={(e) => handleChange('type', e.target.value || undefined)}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="input-field w-auto py-2 px-3 text-sm"
          value={filters.sort || 'newest'}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Highest Amount</option>
          <option value="amount_low">Lowest Amount</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-text-muted hover:text-danger bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">Clear</span>
          </button>
        )}
      </div>
    </div>
  );
}
