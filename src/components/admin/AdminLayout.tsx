import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { LogoutModal } from './LogoutModal';
import { AdminDashboardHome } from './pages/AdminDashboardHome';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminBookingsPage } from './pages/AdminBookingsPage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminPackagesPage } from './pages/AdminPackagesPage';
import { AdminPortfolioPage } from './pages/AdminPortfolioPage';
import { AdminGalleryPage } from './pages/AdminGalleryPage';
import { AdminReviewsPage } from './pages/AdminReviewsPage';
import { AdminMessagesPage } from './pages/AdminMessagesPage';
import { AdminNotificationsPage } from './pages/AdminNotificationsPage';
import { AdminProfilePage } from './pages/AdminProfilePage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

interface AdminLayoutProps {
  onSwitchToPublic?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onSwitchToPublic }) => {
  const { activeTab } = useAdmin();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'customers':
        return <AdminCustomersPage />;
      case 'bookings':
        return <AdminBookingsPage />;
      case 'services':
        return <AdminServicesPage />;
      case 'packages':
        return <AdminPackagesPage />;
      case 'portfolio':
        return <AdminPortfolioPage />;
      case 'gallery':
        return <AdminGalleryPage />;
      case 'reviews':
        return <AdminReviewsPage />;
      case 'messages':
        return <AdminMessagesPage />;
      case 'notifications':
        return <AdminNotificationsPage />;
      case 'profile':
        return <AdminProfilePage />;
      case 'settings':
        return <AdminSettingsPage />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-neutral-900 flex font-sans-clean">
      
      {/* Left Sidebar */}
      <AdminSidebar onTriggerLogout={() => setIsLogoutModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        
        {/* Top Navbar */}
        <AdminNavbar 
          onTriggerLogout={() => setIsLogoutModalOpen(true)} 
          onSwitchToPublic={onSwitchToPublic}
        />

        {/* Main View Container with Smooth Spacing */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveTab()}
        </main>

        {/* Studio Admin Footer */}
        <footer className="h-12 border-t border-neutral-200/80 px-6 flex items-center justify-between text-[11px] text-neutral-400 bg-white">
          <span>© 2026 NG DIGITAL STUDIO • Admin Control Suite</span>
          <span className="hidden sm:inline">Crafted for Luxury Visual Storytelling</span>
        </footer>

      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />

    </div>
  );
};
