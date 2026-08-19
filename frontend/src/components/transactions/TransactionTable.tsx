import { ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';

interface Props {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 skeleton rounded-lg" />)}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg bg-surface">
        <FileText className="w-12 h-12 text-text-muted mb-3" />
        <h3 className="text-lg font-medium text-text-primary">No transactions found</h3>
        <p className="text-text-muted mt-1">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Card List */}
      <div className="md:hidden space-y-3">
        {transactions.map(tx => (
          <div key={tx._id} className="card p-4 flex items-center justify-between shadow-card border border-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                tx.type === 'income' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'
              }`}>
                {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-text-primary truncate">{tx.description}</p>
                <p className="text-xs text-text-muted mt-0.5">{tx.category?.name || 'Uncategorized'} • {formatDate(tx.date)}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end shrink-0 pl-2">
              <p className={`font-semibold ${tx.type === 'income' ? 'text-accent' : 'text-text-primary'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => onEdit(tx)} className="text-xs text-primary hover:text-primary-light">Edit</button>
                <button onClick={() => onDelete(tx._id)} className="text-xs text-danger hover:text-red-400">Del</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50">
              <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider rounded-tl-lg">Date</th>
              <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Description</th>
              <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map(tx => (
              <tr key={tx._id} className="hover:bg-surface-hover/50 transition-colors group">
                <td className="p-4 text-sm text-text-muted whitespace-nowrap">
                  {formatDate(tx.date)}
                </td>
                <td className="p-4 text-sm font-medium text-text-primary">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === 'income' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'
                    }`}>
                      {tx.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    {tx.description}
                  </div>
                </td>
                <td className="p-4 text-sm text-text-muted">
                  {tx.category?.name || 'Uncategorized'}
                </td>
                <td className={`p-4 text-sm font-semibold whitespace-nowrap ${tx.type === 'income' ? 'text-accent' : 'text-text-primary'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(tx)} className="text-sm font-medium text-primary hover:text-primary-light">
                      Edit
                    </button>
                    <button onClick={() => onDelete(tx._id)} className="text-sm font-medium text-danger hover:text-red-400">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
