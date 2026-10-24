import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { PackagesPage } from './components/pages/PackagesPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { ContactPage } from './components/pages/ContactPage';
import { BookingFlow } from './components/booking/BookingFlow';
import { MyBookingsPage } from './components/pages/MyBookingsPage';
import { Lightbox } from './components/common/Lightbox';
import { AuthModal } from './components/auth/AuthModal';
import { MessageCircle } from 'lucide-react';
import { PageType, GalleryPhoto, UserAccount, PackageItem } from './types';
import { STUDIO_INFO } from './data/studioData';
import { AdminPanelApp } from '../admin-panel/src/App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { firebaseAuthService } from './services/firebaseAuth';
import { ADMIN_EMAILS } from './firebase/config';

export default function App() {
  // App routing: 'customer' (for website visitors) or 'admin' (dedicated administrative portal)
  const [activeApp, setActiveApp] = useState<'customer' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (pathname.startsWith('/admin') || hash === '#admin' || pathname === '/admin.html') {
        return 'admin';
      }
    }
    return 'customer';
  });

  // Customer website navigation & states
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [currentServiceId, setCurrentServiceId] = useState<string>('wedding-photography');
  const [bookingPackageId, setBookingPackageId] = useState<string | undefined>(undefined);
  const [bookingCustomizations, setBookingCustomizations] = useState<string[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('ng_studio_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((fbUser) => {
      if (fbUser) {
        const updatedUser: UserAccount = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Client',
          email: fbUser.email || '',
          phone: '',
          isLoggedIn: true,
          emailVerified: fbUser.emailVerified,
          role: fbUser.email && ADMIN_EMAILS.includes(fbUser.email.toLowerCase()) ? 'admin' : 'customer'
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('ng_studio_user', JSON.stringify(updatedUser));
      } else {
        setCurrentUser(null);
        localStorage.removeItem('ng_studio_user');
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync hash/URL with app routing
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (pathname.startsWith('/admin') || hash === '#admin' || pathname === '/admin.html') {
        setActiveApp('admin');
      } else {
        setActiveApp('customer');
      }
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleNavigate = (page: PageType, serviceId?: string) => {
    setCurrentPage(page);
    if (serviceId) {
      setCurrentServiceId(serviceId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackageForBooking = (pkg: PackageItem, customizations: string[] = []) => {
    setBookingPackageId(pkg.id);
    setBookingCustomizations(customizations);
    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPhotoFromUrl = (url: string, title: string) => {
    setActivePhoto({
      id: `photo-${Date.now()}`,
      title,
      category: 'Wedding',
      url,
      description: 'Master studio capture by NG Digital Studio.'
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* ========================================================== */}
      {/* 1. SEPARATE ADMIN PANEL APPLICATION                        */}
      {/* (Rendered exclusively when accessing /admin or #admin)     */}
      {/* ========================================================== */}
      {activeApp === 'admin' ? (
        <AdminPanelApp />
      ) : (
        /* ========================================================== */
        /* 2. CUSTOMER-FACING WEBSITE (HOMEPAGE & PUBLIC PAGES)       */
        /* (Rendered exclusively for customers, zero admin controls)  */
        /* ========================================================== */
        <div className="min-h-screen bg-[#0b0b0d] text-[#f4f4f5] flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#f3e5ab] font-sans-clean">
          {/* Pure Customer Navbar (NO admin button inside) */}
          <Navbar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onOpenAuth={() => {
              setAuthInitialMode('login');
              setIsAuthOpen(true);
            }}
            onLogout={async () => {
              try {
                await firebaseAuthService.logout();
              } catch (e) {
                console.warn("Logout notice:", e);
              }
              localStorage.removeItem('ng_studio_user');
              setCurrentUser(null);
            }}
          />

          <main className="flex-1 w-full">
            <ErrorBoundary fallbackTitle="Review Section" onReset={() => handleNavigate('home')}>
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onSelectPhoto={handleSelectPhotoFromUrl}
                />
              )}
              {currentPage === 'about' && (
                <AboutPage
                  onNavigate={handleNavigate}
                  onSelectPhoto={handleSelectPhotoFromUrl}
                />
              )}
              {currentPage === 'services' && (
                <ServicesPage onNavigate={handleNavigate} />
              )}
              {currentPage === 'service-detail' && (
                <ServiceDetailPage
                  serviceId={currentServiceId}
                  onNavigate={handleNavigate}
                  onSelectPhoto={handleSelectPhotoFromUrl}
                />
              )}
              {currentPage === 'portfolio' && (
                <PortfolioPage
                  onOpenLightbox={(photo) => setActivePhoto(photo)}
                  onNavigate={handleNavigate}
                />
              )}
              {currentPage === 'packages' && (
                <PackagesPage
                  currentUser={currentUser}
                  onOpenAuth={() => {
                    setAuthInitialMode('login');
                    setIsAuthOpen(true);
                  }}
                  onSelectPackageForBooking={handleSelectPackageForBooking}
                  onNavigate={handleNavigate}
                />
              )}
              {currentPage === 'gallery' && (
                <GalleryPage
                  onOpenLightbox={(photo) => setActivePhoto(photo)}
                  onNavigate={handleNavigate}
                />
              )}
              {currentPage === 'reviews' && (
                <ReviewsPage onNavigate={handleNavigate} />
              )}
              {currentPage === 'contact' && (
                <ContactPage onNavigate={handleNavigate} />
              )}
              {currentPage === 'booking' && (
                <BookingFlow
                  currentUser={currentUser}
                  initialServiceId={currentServiceId}
                  initialPackageId={bookingPackageId}
                  initialCustomizations={bookingCustomizations}
                  onOpenAuth={() => {
                    setAuthInitialMode('login');
                    setIsAuthOpen(true);
                  }}
                  onBookingComplete={(b) => console.log('Booking submitted:', b)}
                  onNavigateHome={() => handleNavigate('home')}
                  onNavigate={handleNavigate}
                />
              )}
              {currentPage === 'my-bookings' && (
                <MyBookingsPage
                  currentUser={currentUser}
                  onNavigate={handleNavigate}
                  onOpenAuth={() => {
                    setAuthInitialMode('login');
                    setIsAuthOpen(true);
                  }}
                />
              )}
            </ErrorBoundary>
          </main>

          <Footer onNavigate={handleNavigate} />

          {/* Floating WhatsApp Quick Connect Button */}
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
            <a
              id="floating-whatsapp-btn"
              href={STUDIO_INFO.whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="hidden sm:inline font-sans-clean">Chat with Studio</span>
            </a>
          </div>

          {/* Lightbox Modal */}
          {activePhoto && (
            <Lightbox
              photo={activePhoto}
              onClose={() => setActivePhoto(null)}
              onBookThisStyle={() => {
                setActivePhoto(null);
                handleNavigate('booking');
              }}
            />
          )}

          {/* Customer Auth Modal */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              setIsAuthOpen(false);
            }}
            initialMode={authInitialMode}
          />
        </div>
      )}
    </div>
  );
}
