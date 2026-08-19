import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Wallet,
  Target,
  BarChart3,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/categories', label: 'Categories', icon: Tag },
  { path: '/budgets', label: 'Budgets', icon: Wallet },
  { path: '/savings-goals', label: 'Savings Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
  { path: '/guide', label: 'Guide', icon: HelpCircle },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        hidden md:flex flex-col fixed left-0 top-0 h-screen z-40
        bg-surface border-r border-border transition-all duration-300
        ${collapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'}
      `}
      style={{
        '--sidebar-width': '240px',
        '--sidebar-collapsed': '64px',
      } as React.CSSProperties}
    >
      {/* Logo area */}
      <div className={`flex items-center h-16 px-4 border-b border-border ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Wallet className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-text-primary font-bold text-lg whitespace-nowrap animate-fade-in">
            SmartExpense
          </span>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group
              ${collapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-primary/15 text-primary-light border-l-2 border-primary'
                : 'text-text-muted hover:bg-surface-hover hover:text-text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
            {/* Tooltip on collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface-hover text-text-primary text-xs rounded-md
                opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50
                shadow-card border border-border">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-border
          text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
