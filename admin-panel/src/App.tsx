import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminLoginPage } from './components/pages/AdminLoginPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { CustomersPage } from './components/pages/CustomersPage';
import { BookingsPage } from './components/pages/BookingsPage';
import { PackagesPage } from './components/pages/PackagesPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { api } from './services/api';

const AdminContent: React.FC = () => {
  const { adminUser, loading } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

  // Poll badges for pending bookings & reviews
  const refreshBadges = async () => {
    if (!adminUser) return;
    try {
      const stats = await api.getDashboardStats();
      setPendingBookingsCount(stats.pendingBookings);
      const revs = await api.getReviews('Pending');
      setPendingReviewsCount(revs.length);
    } catch (e) {
      // Background poll silent fallback
    }
  };

  useEffect(() => {
    if (adminUser) {
      refreshBadges();
      const interval = setInterval(refreshBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [adminUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
          Verifying NG Digital Studio Admin Session...
        </p>
      </div>
    );
  }

  // Not logged in -> Render standalone Admin Login Page
  if (!adminUser) {
    return <AdminLoginPage />;
  }

  const getTabTitles = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Data Analytics Dashboard', subtitle: 'Monthly booking analysis, confirmed booking values and two-month comparison' };
      case 'customers':
        return { title: 'Customer Directory', subtitle: 'Registered photography clients, contact profiles & booking logs' };
      case 'bookings':
        return { title: 'Bookings & Reservations', subtitle: 'Manage shoot bookings, dispatch confirmation emails & update schedules' };
      case 'packages':
        return { title: 'Wedding & Studio Packages', subtitle: 'Configure Budget, Luxury & Semi-Luxury package deliverables and rates' };
      case 'gallery':
        return { title: 'Studio Portfolio Media', subtitle: 'Upload and categorize photography across 9 ceremony collections' };
      case 'reviews':
        return { title: 'Client Reviews Moderation', subtitle: 'Moderate live customer reviews before publishing to customer website' };
      default:
        return { title: 'Studio Admin Portal', subtitle: 'NG Digital Studio Management System' };
    }
  };

  const { title, subtitle } = getTabTitles(currentTab);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f4f4f6] flex flex-col lg:flex-row font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          refreshBadges();
        }}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        pendingBookingsCount={pendingBookingsCount}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && <DashboardPage onNavigateTab={(t) => { setCurrentTab(t); refreshBadges(); }} />}
          {currentTab === 'customers' && <CustomersPage />}
          {currentTab === 'bookings' && <BookingsPage />}
          {currentTab === 'packages' && <PackagesPage />}
          {currentTab === 'gallery' && <GalleryPage />}
          {currentTab === 'reviews' && <ReviewsPage />}
        </main>
      </div>
    </div>
  );
};

export function AdminPanelApp() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}

export default AdminPanelApp;
