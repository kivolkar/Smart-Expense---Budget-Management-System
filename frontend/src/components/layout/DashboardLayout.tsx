import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop/Tablet sidebar */}
      <Sidebar />

      {/* Main content area — offset for sidebar on md+ screens */}
      <div className="md:ml-16 lg:ml-60 transition-all duration-300">
        <Navbar />

        {/* Page content */}
        <main className="pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
