import { AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = true
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        
        <div className="flex justify-between items-start p-4 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDestructive ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-2">
          <p className="text-sm text-text-muted leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-4 mt-4 flex gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 py-2.5 rounded-lg font-medium border border-border text-text-primary hover:bg-surface-hover transition-colors"
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className={`flex-1 py-2.5 rounded-lg font-semibold text-white transition-colors ${
              isDestructive ? 'bg-danger hover:bg-red-600 shadow-glow shadow-danger/20' : 'bg-primary hover:bg-primary-dark shadow-glow'
            }`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
