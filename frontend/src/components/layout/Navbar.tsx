import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, User as UserIcon, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfileModal from '../profile/ProfileModal';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
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

            {/* Profile Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-transparent hover:border-border hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center uppercase shadow-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>

              {/* Floating Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl py-2 animate-fade-in overflow-hidden z-50">
                  <div className="px-4 py-2 border-b border-border/50 mb-1">
                    <p className="text-xs text-text-muted uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-text-primary truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-hover hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" /> Security / Profile
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Render the Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
