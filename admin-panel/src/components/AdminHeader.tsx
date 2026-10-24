import React from 'react';
import { Menu, Shield, ExternalLink } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  onOpenMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu
}) => {
  const { adminUser } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#0b0b0f]/90 backdrop-blur-md border-b border-[#20202a] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg bg-[#14141c] border border-neutral-800 text-neutral-300 hover:text-white lg:hidden"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-neutral-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Customer Website Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14141c] hover:bg-[#1a1a26] border border-neutral-800 hover:border-[#d4af37]/60 text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
          title="Open Customer Website"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden sm:inline">Customer Website</span>
          <span className="sm:hidden">Website</span>
        </a>

        {/* Studio Admin Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 border border-[#d4af37]/40 text-xs font-semibold text-[#d4af37]">
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Admin:</span>
          <span className="text-white font-medium">{adminUser?.email?.split('@')[0] || 'Studio'}</span>
        </div>
      </div>
    </header>
  );
};
