import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck2, 
  Package, 
  Image as ImageIcon, 
  Star, 
  LogOut, 
  ShieldCheck, 
  X,
  Globe
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export type AdminTab = 'dashboard' | 'customers' | 'bookings' | 'packages' | 'gallery' | 'reviews';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  pendingBookingsCount?: number;
  pendingReviewsCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  pendingBookingsCount = 0,
  pendingReviewsCount = 0
}) => {
  const { adminUser, logout } = useAdminAuth();

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
    { 
      id: 'bookings' as AdminTab, 
      label: 'Bookings', 
      icon: CalendarCheck2, 
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
      badgeColor: 'bg-amber-500 text-black'
    },
    { id: 'packages' as AdminTab, label: 'Packages', icon: Package },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: ImageIcon },
    { 
      id: 'reviews' as AdminTab, 
      label: 'Reviews', 
      icon: Star,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
      badgeColor: 'bg-emerald-500 text-black'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0e0e13] border-r border-[#262630] flex flex-col justify-between transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Header Brand */}
          <div className="p-5 border-b border-[#20202a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#997d26] p-0.5 flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
                <div className="w-full h-full bg-[#121217] rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img
                    src="/images of studio/123232.jpg"
                    alt="NG Digital Studio Logo"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-wide text-white font-['Cinzel',serif]">
                  NG DIGITAL
                </h1>
                <p className="text-[11px] text-[#d4af37] font-semibold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Panel
                </p>
              </div>
            </div>

            <button 
              onClick={onCloseMobile}
              className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-sidebar-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#d4af37]/20 to-transparent border-l-4 border-[#d4af37] text-white shadow-sm' 
                      : 'text-neutral-400 hover:text-white hover:bg-[#16161f]'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-[#20202a] bg-[#0a0a0e]/60 space-y-2.5">
          <a
            href="/"
            className="w-full py-2 px-3 rounded-xl border border-neutral-800 bg-[#121218] hover:bg-[#1a1a24] text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-between group transition-all"
            title="Open Public Customer Website"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Customer Website</span>
            </div>
            <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 font-mono">/</span>
          </a>

          <div className="flex items-center justify-between gap-3 px-2 py-2 rounded-xl bg-[#14141c] border border-neutral-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#20202a] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0">
                {adminUser?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-neutral-400 truncate">{adminUser?.email}</p>
              </div>
            </div>
          </div>

          <button
            id="admin-logout-btn"
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl border border-red-950/60 bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 text-xs font-medium flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
