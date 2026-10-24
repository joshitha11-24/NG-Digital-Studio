import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  UserCircle2, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Check, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Globe
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminNavbarProps {
  onTriggerLogout: () => void;
  onSwitchToPublic?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onTriggerLogout, onSwitchToPublic }) => {
  const { 
    adminUser, 
    setIsSidebarOpen, 
    searchQuery, 
    setSearchQuery, 
    notifications, 
    unreadNotificationCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    setActiveTab,
    setSelectedBookingId,
    setSelectedCustomerId
  } = useAdmin();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    setIsNotifOpen(false);
    if (n.targetTab) {
      setActiveTab(n.targetTab);
      if (n.targetTab === 'bookings' && n.targetId) {
        setSelectedBookingId(n.targetId);
      } else if (n.targetTab === 'customers' && n.targetId) {
        setSelectedCustomerId(n.targetId);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-neutral-200/90 shadow-sm px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 font-sans-clean">
      
      {/* Left Area: Mobile Menu Toggle & Search Bar */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          id="btn-admin-mobile-menu"
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          title="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookings, customers, services..."
            className="w-full bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Area: Status, Notifications & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Switch to Public Website Button */}
        {onSwitchToPublic && (
          <button
            id="admin-btn-view-public-site"
            onClick={onSwitchToPublic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700 shadow-sm transition-all"
            title="Return to Public Website"
          >
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">Public Website</span>
          </button>
        )}

        {/* Studio Status Pill (Hidden on xs) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-xs text-amber-900 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Studio Active • Madurai</span>
        </div>

        {/* Notification Dropdown Container */}
        <div className="relative" ref={notifRef}>
          <button
            id="admin-btn-notifications"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#d4af37] text-black text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Notification Menu Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 font-cinzel">Studio Notifications</h4>
                  <p className="text-[10px] text-neutral-500">{unreadNotificationCount} unread alerts</p>
                </div>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#aa820a] hover:text-[#8a6805] font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    No new studio notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 hover:bg-neutral-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !n.isRead ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#aa820a] flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-neutral-900 truncate">
                            {n.title}
                          </h5>
                          <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 line-clamp-2 mt-0.5">
                          {n.message}
                        </p>
                      </div>
                      {!n.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-neutral-100 text-center">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs font-semibold text-[#aa820a] hover:text-neutral-900 w-full py-1"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            id="admin-btn-profile-dropdown"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all text-left"
          >
            <img
              src={adminUser.avatar}
              alt={adminUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#d4af37]"
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-neutral-900 leading-tight">
                {adminUser.name}
              </div>
              <div className="text-[11px] text-[#aa820a] font-medium leading-tight">
                {adminUser.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in divide-y divide-neutral-100">
              
              <div className="px-4 py-2.5">
                <p className="text-xs font-bold text-neutral-900">{adminUser.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{adminUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-[#aa820a] text-[10px] font-semibold rounded-md border border-amber-200">
                  {adminUser.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2.5 font-medium"
                >
                  <UserCircle2 className="w-4 h-4 text-neutral-500" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 flex items-center gap-2.5 font-medium"
                >
                  <Settings className="w-4 h-4 text-neutral-500" />
                  <span>Studio Settings</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onTriggerLogout();
                  }}
                  className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
};
