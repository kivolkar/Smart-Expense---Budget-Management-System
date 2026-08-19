import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left: Mobile logo + Desktop greeting */}
        <div className="flex items-center gap-3">
          {/* Mobile logo — only visible below md */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-text-primary font-bold text-base">SmartExpense</span>
          </div>

          {/* Desktop greeting — hidden on mobile */}
          <div className="hidden md:block">
            <p className="text-text-primary font-semibold text-sm">
              {getGreeting()}, <span className="text-primary-light">{user?.name || 'User'}</span>
            </p>
            <p className="text-text-muted text-xs">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {/* Insights bell */}
          <button
            onClick={() => navigate('/insights')}
            className="btn-ghost relative p-2"
            title="Smart Insights"
          >
            <Bell className="w-5 h-5" />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-warning rounded-full" />
          </button>

          {/* Logout */}
          <button onClick={handleLogout} className="btn-ghost p-2" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
