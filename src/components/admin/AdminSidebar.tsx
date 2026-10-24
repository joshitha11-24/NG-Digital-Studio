import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Star, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  UserCircle2, 
  X,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTab } from '../../types/admin';

interface AdminSidebarProps {
  onTriggerLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onTriggerLogout }) => {
  const { 
    activeTab, 
    setActiveTab, 
    isSidebarOpen, 
    setIsSidebarOpen, 
    stats, 
    unreadNotificationCount, 
    messages,
    adminUser
  } = useAdmin();

  const unreadMessagesCount = messages.filter(m => m.status === 'Unread').length;

  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users, badge: stats.totalCustomers > 0 ? stats.totalCustomers : undefined, badgeColor: 'bg-neutral-800 text-neutral-300' },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: stats.pendingBookings > 0 ? stats.pendingBookings : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined, badgeColor: 'bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40' },
    { id: 'profile', label: 'Admin Profile', icon: UserCircle2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0c0c11] border-r border-neutral-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        {/* Top Header & Brand */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2215] to-[#121218] border border-[#d4af37]/60 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] overflow-hidden">
                <img
                  src="/images of studio/123232.jpg"
                  alt="NG Digital Studio Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h1 className="font-cinzel text-sm font-extrabold tracking-wider text-white uppercase leading-none">
                  NG DIGITAL STUDIO
                </h1>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold mt-1 block">
                  Studio Admin
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu Links */}
          <div className="py-4 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
            <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-neutral-500">
              Management
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#221c10] to-[#171720] text-[#f3e5ab] border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.12)]' 
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#d4af37]' : 'text-neutral-400 group-hover:text-neutral-200'}`} />
                    <span className="font-sans-clean">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-neutral-800 text-neutral-300'}`}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[0_0_6px_#d4af37]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile & Logout Footer */}
        <div className="p-3 border-t border-neutral-800/80 space-y-2 bg-[#09090d]">
          <div 
            onClick={() => handleSelectTab('profile')}
            className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-all"
          >
            <img
              src={adminUser.avatar}
              alt={adminUser.name}
              className="w-9 h-9 rounded-full object-cover border border-[#d4af37]/40 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate font-sans-clean">
                {adminUser.name}
              </h4>
              <p className="text-[10px] text-neutral-400 truncate">
                {adminUser.role}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
          </div>

          <button
            id="sidebar-btn-logout"
            onClick={onTriggerLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Studio</span>
          </button>
        </div>

      </aside>
    </>
  );
};
