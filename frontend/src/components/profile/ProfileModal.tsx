import { useState } from 'react';
import { X, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        return toast.error('New passwords do not match');
    }
    if (newPassword.length < 6) {
        return toast.error('Password must be at least 6 characters');
    }

    try {
      setIsSubmitting(true);
      await authService.changePassword({ currentPassword, newPassword });
      toast.success('Security barrier updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: any) {
      // Error handled by global Axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header Ribbon */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-surface/50">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            User Settings
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border px-4">
            <button 
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
            >
                <UserIcon className="w-4 h-4" /> Account Details
            </button>
            <button 
                onClick={() => setActiveTab('security')}
                className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                    activeTab === 'security' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
            >
                <Lock className="w-4 h-4" /> Security
            </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
            {activeTab === 'profile' ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-bold text-2xl uppercase tracking-widest">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">{user?.name}</h3>
                            <p className="text-sm text-text-muted">{user?.email}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg border border-border/50">
                        <p className="text-sm text-text-muted mb-1">Account Role</p>
                        <p className="font-mono text-primary font-medium">Platform Administrator</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="label">Current Password</label>
                        <input 
                            type="password" 
                            className="input-field font-mono text-sm" 
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="divider" />
                    <div>
                        <label className="label">New Password</label>
                        <input 
                            type="password" 
                            className="input-field font-mono text-sm" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="label">Confirm New Password</label>
                        <input 
                            type="password" 
                            className="input-field font-mono text-sm" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full btn-primary flex justify-center items-center gap-2 mt-2 shadow-glow"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Security Barrier'}
                    </button>
                </form>
            )}
        </div>

      </div>
    </div>
  );
}
