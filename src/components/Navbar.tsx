import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, User, LogOut, PhoneCall } from 'lucide-react';
import { LogoBranding } from './LogoBranding';
import { PageType, UserAccount } from '../types';
import { STUDIO_INFO } from '../data/studioData';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType, serviceId?: string) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Services', page: 'services' },
    { label: 'Portfolio', page: 'portfolio' },
    { label: 'Packages', page: 'packages' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Reviews', page: 'reviews' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0d]/95 backdrop-blur-md border-b border-[#d4af37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#07070a]/90 via-[#07070a]/60 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT SIDE: Brand Logo + Studio Name + Slogan */}
          <LogoBranding
            size="md"
            showSlogan={true}
            onClick={() => handleNavClick('home')}
          />

          {/* RIGHT SIDE: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all relative ${
                    isActive
                      ? 'text-[#d4af37] font-bold'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]" />
                  )}
                </button>
              );
            })}

            {/* User Account / My Bookings Indicator */}
            {currentUser && currentUser.isLoggedIn ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-neutral-800">
                <button
                  id="nav-user-profile-btn"
                  onClick={() => handleNavClick('my-bookings')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-[#d4af37]/40 text-xs text-[#f3e5ab] hover:border-[#d4af37] transition-all"
                  title="View Your Bookings"
                >
                  <User className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span className="max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-900 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenAuth}
                className="text-xs font-semibold text-neutral-400 hover:text-white px-2 py-1 ml-1"
              >
                Sign In
              </button>
            )}

            {/* High-Contrast Gold "Book Now" Button */}
            <button
              id="nav-book-now-btn"
              onClick={() => handleNavClick('booking')}
              className="ml-2 px-5 py-2 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold flex items-center gap-1.5 shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Now</span>
            </button>
          </nav>

          {/* Mobile Right Controls: Book Now + Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              id="mobile-nav-book-now-btn"
              onClick={() => handleNavClick('booking')}
              className="px-3 py-1.5 rounded-lg btn-gold text-[11px] uppercase tracking-wider font-extrabold shadow-sm"
            >
              Book Now
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-[#14141c] border border-neutral-800 text-neutral-300 hover:text-[#d4af37] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Down Navigation Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="xl:hidden bg-[#0c0c10]/98 backdrop-blur-xl border-b border-[#d4af37]/30 px-6 py-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl"
        >
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left py-2 px-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#d4af37]/15 text-[#d4af37] border-l-2 border-[#d4af37]'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="text-xs text-[#d4af37]">●</span>}
                </button>
              );
            })}

            {/* Mobile Auth & Bookings */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
              {currentUser && currentUser.isLoggedIn ? (
                <div className="flex items-center justify-between bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <div className="flex items-center gap-2 text-xs text-neutral-300">
                    <User className="w-4 h-4 text-[#d4af37]" />
                    <span className="font-semibold text-white">{currentUser.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleNavClick('my-bookings')}
                      className="text-xs text-[#d4af37] underline font-semibold"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={onLogout}
                      className="text-xs text-red-400 font-semibold ml-2"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 text-xs font-semibold text-white border border-neutral-800"
                >
                  Sign In / Register
                </button>
              )}

              <button
                onClick={() => handleNavClick('booking')}
                className="w-full py-3 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Photography Package</span>
              </button>

              <a
                href={`tel:${STUDIO_INFO.phone}`}
                className="flex items-center justify-center gap-2 text-xs text-[#d4af37] py-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Direct Studio Line: {STUDIO_INFO.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
