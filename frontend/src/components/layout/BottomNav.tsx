import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Menu,
  Tag,
  Target,
  Lightbulb,
  HelpCircle,
  X
} from 'lucide-react';

const bottomNavItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Budgets', icon: Wallet },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const moreItems = [
  { path: '/categories', label: 'Categories', icon: Tag },
  { path: '/savings-goals', label: 'Savings Goals', icon: Target },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
  { path: '/guide', label: 'User Guide', icon: HelpCircle },
];

export default function BottomNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreOpen]);

  return (
    <>
      {/* Sliding 'More' Panel */}
      <div 
        ref={moreRef}
        className={`md:hidden fixed bottom-16 left-0 right-0 bg-surface border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform duration-300 z-40 rounded-t-2xl overflow-hidden ${
          isMoreOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="p-4 bg-surface/50 backdrop-blur-md">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/50">
            <h3 className="font-bold text-text-primary text-lg">More Menu</h3>
            <button onClick={() => setIsMoreOpen(false)} className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {moreItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMoreOpen(false)}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-background transition-all
                  ${isActive ? 'border-primary/50 text-primary bg-primary/5' : 'text-text-muted hover:border-text-muted hover:text-text-primary'}`
                }
              >
                <item.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-lg transition-colors
                ${isActive
                  ? 'text-primary'
                  : 'text-text-muted'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-lg transition-colors ${
              isMoreOpen ? 'text-primary' : 'text-text-muted'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
