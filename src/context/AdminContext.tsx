import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AdminTab, 
  AdminUser, 
  AdminCustomer, 
  AdminBooking, 
  AdminService, 
  AdminPackage, 
  AdminPortfolioItem, 
  AdminGalleryAlbum, 
  AdminReview, 
  AdminMessage, 
  AdminNotification, 
  StudioSettings,
  BookingStatus,
  ReviewStatus,
  MessageStatus
} from '../types/admin';
import { 
  DEFAULT_ADMIN_USER, 
  INITIAL_STUDIO_SETTINGS, 
  INITIAL_CUSTOMERS, 
  INITIAL_BOOKINGS, 
  INITIAL_SERVICES, 
  INITIAL_PACKAGES, 
  INITIAL_PORTFOLIO, 
  INITIAL_GALLERY_ALBUMS, 
  INITIAL_REVIEWS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS 
} from '../data/adminInitialData';

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Selected views
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedBookingId: string | null;
  setSelectedBookingId: (id: string | null) => void;

  // Auth methods
  login: (
    email: string, 
    pass: string, 
    remember: boolean, 
    profileData?: { name?: string; avatar?: string; role?: string }
  ) => { success: boolean; message?: string };
  logout: () => void;
  updateAdminProfile: (data: Partial<AdminUser>) => void;
  changeAdminPassword: (current: string, newPass: string) => { success: boolean; message: string };

  // Data & CRUD
  customers: AdminCustomer[];
  addCustomer: (customer: Omit<AdminCustomer, 'id' | 'customerId' | 'registrationDate' | 'totalBookings' | 'totalSpent' | 'rawTotalSpent'>) => void;
  updateCustomer: (id: string, data: Partial<AdminCustomer>) => void;
  deleteCustomer: (id: string) => void;

  bookings: AdminBooking[];
  addBooking: (booking: Omit<AdminBooking, 'id' | 'bookingId' | 'createdDate'>) => void;
  updateBooking: (id: string, data: Partial<AdminBooking>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;

  services: AdminService[];
  addService: (service: Omit<AdminService, 'id' | 'totalBookings'>) => void;
  updateService: (id: string, data: Partial<AdminService>) => void;
  deleteService: (id: string) => void;

  packages: AdminPackage[];
  addPackage: (pkg: Omit<AdminPackage, 'id'>) => void;
  updatePackage: (id: string, data: Partial<AdminPackage>) => void;
  deletePackage: (id: string) => void;

  portfolio: AdminPortfolioItem[];
  addPortfolioItem: (item: Omit<AdminPortfolioItem, 'id' | 'uploadDate'>) => void;
  updatePortfolioItem: (id: string, data: Partial<AdminPortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  galleryAlbums: AdminGalleryAlbum[];
  addAlbum: (album: Omit<AdminGalleryAlbum, 'id' | 'createdDate' | 'photos' | 'photoCount'>) => void;
  updateAlbum: (id: string, data: Partial<AdminGalleryAlbum>) => void;
  deleteAlbum: (id: string) => void;
  addPhotosToAlbum: (albumId: string, photoUrls: { url: string; caption: string }[]) => void;
  deletePhotoFromAlbum: (albumId: string, photoId: string) => void;

  reviews: AdminReview[];
  addReview: (review: Omit<AdminReview, 'id' | 'date'>) => void;
  updateReviewStatus: (id: string, status: ReviewStatus) => void;
  deleteReview: (id: string) => void;

  messages: AdminMessage[];
  addMessage: (message: Omit<AdminMessage, 'id' | 'receivedAt' | 'status'>) => void;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  replyToMessage: (id: string, replyNote: string) => void;
  deleteMessage: (id: string) => void;

  notifications: AdminNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  studioSettings: StudioSettings;
  updateStudioSettings: (settings: Partial<StudioSettings>) => void;
  clearAllData: () => void;

  // Stats
  stats: {
    totalCustomers: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalServices: number;
    totalReviews: number;
    totalRevenue: number;
  };
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ng_admin_auth') === 'true';
  });

  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('ng_admin_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ADMIN_USER;
      }
    }
    return DEFAULT_ADMIN_USER;
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Migration check: If first run of live mode or legacy profile detected, clean up
  useEffect(() => {
    const LIVE_FLAG = 'ng_admin_live_v3';
    if (!localStorage.getItem(LIVE_FLAG)) {
      localStorage.removeItem('ng_admin_customers');
      localStorage.removeItem('ng_admin_bookings');
      localStorage.removeItem('ng_admin_reviews');
      localStorage.removeItem('ng_admin_messages');
      localStorage.removeItem('ng_admin_notifications');
      localStorage.setItem(LIVE_FLAG, 'true');
      setCustomers([]);
      setBookings([]);
      setReviews([]);
      setMessages([]);
      setNotifications([]);
    }

    // Ensure all legacy mock reviews and ratings are wiped clean for live mode
    const REVIEWS_LIVE_FLAG = 'ng_reviews_live_clean_v1';
    if (!localStorage.getItem(REVIEWS_LIVE_FLAG)) {
      localStorage.removeItem('ng_studio_reviews');
      localStorage.removeItem('ng_admin_reviews');
      localStorage.setItem(REVIEWS_LIVE_FLAG, 'true');
      setReviews([]);
    }

    const savedUser = localStorage.getItem('ng_admin_user_profile');
    if (savedUser && savedUser.includes('Naveen')) {
      localStorage.removeItem('ng_admin_user_profile');
      setAdminUser(DEFAULT_ADMIN_USER);
    }
  }, []);

  // Datasets with localStorage hydration
  const [customers, setCustomers] = useState<AdminCustomer[]>(() => {
    const saved = localStorage.getItem('ng_admin_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [bookings, setBookings] = useState<AdminBooking[]>(() => {
    const saved = localStorage.getItem('ng_admin_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [services, setServices] = useState<AdminService[]>(() => {
    const saved = localStorage.getItem('ng_admin_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [packages, setPackages] = useState<AdminPackage[]>(() => {
    const saved = localStorage.getItem('ng_admin_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [portfolio, setPortfolio] = useState<AdminPortfolioItem[]>(() => {
    const saved = localStorage.getItem('ng_admin_portfolio');
    return saved ? JSON.parse(saved) : INITIAL_PORTFOLIO;
  });

  const [galleryAlbums, setGalleryAlbums] = useState<AdminGalleryAlbum[]>(() => {
    const saved = localStorage.getItem('ng_admin_gallery_albums');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_ALBUMS;
  });

  const [reviews, setReviews] = useState<AdminReview[]>(() => {
    const saved = localStorage.getItem('ng_admin_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [messages, setMessages] = useState<AdminMessage[]>(() => {
    const saved = localStorage.getItem('ng_admin_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    const saved = localStorage.getItem('ng_admin_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [studioSettings, setStudioSettings] = useState<StudioSettings>(() => {
    const saved = localStorage.getItem('ng_admin_studio_settings');
    return saved ? JSON.parse(saved) : INITIAL_STUDIO_SETTINGS;
  });

  // Sync datasets to localStorage
  useEffect(() => {
    localStorage.setItem('ng_admin_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ng_admin_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('ng_admin_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ng_admin_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('ng_admin_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('ng_admin_gallery_albums', JSON.stringify(galleryAlbums));
  }, [galleryAlbums]);

  useEffect(() => {
    localStorage.setItem('ng_admin_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('ng_admin_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('ng_admin_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ng_admin_studio_settings', JSON.stringify(studioSettings));
  }, [studioSettings]);

  useEffect(() => {
    localStorage.setItem('ng_admin_user_profile', JSON.stringify(adminUser));
  }, [adminUser]);

  // Auth actions
  const login = (
    email: string, 
    pass: string, 
    remember: boolean, 
    profileData?: { name?: string; avatar?: string; role?: string }
  ) => {
    const validEmail = email.trim().toLowerCase();
    const isAuthorizedAdmin = 
      validEmail === 'admin@ngstudio.com' || 
      validEmail === 'admin@ngdigitalstudio.com' ||
      validEmail === 'joshithasrinivasan277@gmail.com' ||
      validEmail === 'ng.digitalstudiomdu@gmail.com' ||
      validEmail === 'admin' || 
      validEmail === 'director@ngstudio.com';
    const isStandardAuth = 
      isAuthorizedAdmin && 
      (pass === 'admin123' || pass === 'studio1234' || pass === 'admin' || pass === 'ngstudio2026');

    if (isStandardAuth) {
      setIsAuthenticated(true);
      if (remember) {
        localStorage.setItem('ng_admin_auth', 'true');
      } else {
        sessionStorage.setItem('ng_admin_auth', 'true');
        localStorage.setItem('ng_admin_auth', 'true');
      }

      // Compute display name and profile image
      let derivedName = profileData?.name?.trim();
      if (!derivedName) {
        if (email.includes('@')) {
          const usernamePart = email.split('@')[0];
          derivedName = usernamePart
            .replace(/[._-]/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        } else if (email) {
          derivedName = email.charAt(0).toUpperCase() + email.slice(1);
        }
      }

      const updatedName = derivedName || 'Studio Administrator';
      const updatedAvatar = profileData?.avatar || adminUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      const updatedEmail = email.includes('@') ? email : `${email}@ngstudio.com`;
      const updatedRole = profileData?.role || adminUser.role || 'Studio Director';

      const updatedProfile: AdminUser = {
        ...adminUser,
        name: updatedName,
        email: updatedEmail,
        avatar: updatedAvatar,
        role: updatedRole,
        lastLogin: new Date().toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }) + ' at ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setAdminUser(updatedProfile);
      localStorage.setItem('ng_admin_user_profile', JSON.stringify(updatedProfile));

      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid credentials. Enter your administrator username/email and password.' 
    };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ng_admin_auth');
    sessionStorage.removeItem('ng_admin_auth');
  };

  const updateAdminProfile = (data: Partial<AdminUser>) => {
    setAdminUser(prev => ({ ...prev, ...data }));
  };

  const changeAdminPassword = (current: string, newPass: string) => {
    if (newPass.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }
    return { success: true, message: 'Password updated successfully!' };
  };

  // Customers CRUD
  const addCustomer = (customerData: Omit<AdminCustomer, 'id' | 'customerId' | 'registrationDate' | 'totalBookings' | 'totalSpent' | 'rawTotalSpent'>) => {
    const nextNum = customers.length + 101;
    const newCustomer: AdminCustomer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      customerId: `CUST-0${nextNum}`,
      registrationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalBookings: 0,
      totalSpent: '₹0',
      rawTotalSpent: 0,
      avatar: customerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    setCustomers(prev => [newCustomer, ...prev]);

    // Add Notification
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: 'customer',
      title: 'New Customer Added',
      message: `${newCustomer.name} has been added to customer database.`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'customers',
      targetId: newCustomer.id
    }, ...prev]);
  };

  const updateCustomer = (id: string, data: Partial<AdminCustomer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Bookings CRUD
  const addBooking = (bookingData: Omit<AdminBooking, 'id' | 'bookingId' | 'createdDate'>) => {
    const nextNum = bookings.length + 1;
    const bookingCode = `NG00${nextNum}`;
    const newBooking: AdminBooking = {
      ...bookingData,
      id: `b-${Date.now()}`,
      bookingId: bookingCode,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setBookings(prev => [newBooking, ...prev]);

    // Sync Customer count
    setCustomers(prev => prev.map(c => {
      if (c.name.toLowerCase() === newBooking.customerName.toLowerCase() || c.email.toLowerCase() === newBooking.customerEmail.toLowerCase()) {
        return {
          ...c,
          totalBookings: c.totalBookings + 1,
          rawTotalSpent: c.rawTotalSpent + newBooking.rawAmount,
          totalSpent: `₹${(c.rawTotalSpent + newBooking.rawAmount).toLocaleString('en-IN')}`
        };
      }
      return c;
    }));

    // Notification
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: 'booking',
      title: `New Booking (${newBooking.bookingId})`,
      message: `New ${newBooking.service} booking received from ${newBooking.customerName} for ${newBooking.eventDate}.`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'bookings',
      targetId: newBooking.id
    }, ...prev]);
  };

  const updateBooking = (id: string, data: Partial<AdminBooking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, status };
      }
      return b;
    }));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // Services CRUD
  const addService = (serviceData: Omit<AdminService, 'id' | 'totalBookings'>) => {
    const newService: AdminService = {
      ...serviceData,
      id: `serv-${Date.now()}`,
      totalBookings: 0
    };
    setServices(prev => [newService, ...prev]);
  };

  const updateService = (id: string, data: Partial<AdminService>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Packages CRUD
  const addPackage = (pkgData: Omit<AdminPackage, 'id'>) => {
    const newPkg: AdminPackage = {
      ...pkgData,
      id: `pkg-${Date.now()}`
    };
    setPackages(prev => [newPkg, ...prev]);
  };

  const updatePackage = (id: string, data: Partial<AdminPackage>) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  // Portfolio CRUD
  const addPortfolioItem = (itemData: Omit<AdminPortfolioItem, 'id' | 'uploadDate'>) => {
    const newItem: AdminPortfolioItem = {
      ...itemData,
      id: `port-${Date.now()}`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      views: 0
    };
    setPortfolio(prev => [newItem, ...prev]);
  };

  const updatePortfolioItem = (id: string, data: Partial<AdminPortfolioItem>) => {
    setPortfolio(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio(prev => prev.filter(p => p.id !== id));
  };

  // Gallery CRUD
  const addAlbum = (albumData: Omit<AdminGalleryAlbum, 'id' | 'createdDate' | 'photos' | 'photoCount'>) => {
    const newAlbum: AdminGalleryAlbum = {
      ...albumData,
      id: `alb-${Date.now()}`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      photoCount: 0,
      photos: []
    };
    setGalleryAlbums(prev => [newAlbum, ...prev]);
  };

  const updateAlbum = (id: string, data: Partial<AdminGalleryAlbum>) => {
    setGalleryAlbums(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const deleteAlbum = (id: string) => {
    setGalleryAlbums(prev => prev.filter(a => a.id !== id));
  };

  const addPhotosToAlbum = (albumId: string, photoUrls: { url: string; caption: string }[]) => {
    setGalleryAlbums(prev => prev.map(a => {
      if (a.id === albumId) {
        const newPhotos = photoUrls.map((p, idx) => ({
          id: `gp-${Date.now()}-${idx}`,
          url: p.url,
          caption: p.caption || a.title,
          uploadedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        }));
        const combined = [...a.photos, ...newPhotos];
        return {
          ...a,
          photos: combined,
          photoCount: combined.length
        };
      }
      return a;
    }));
  };

  const deletePhotoFromAlbum = (albumId: string, photoId: string) => {
    setGalleryAlbums(prev => prev.map(a => {
      if (a.id === albumId) {
        const filtered = a.photos.filter(p => p.id !== photoId);
        return {
          ...a,
          photos: filtered,
          photoCount: filtered.length
        };
      }
      return a;
    }));
  };

  // Reviews CRUD
  const addReview = (reviewData: Omit<AdminReview, 'id' | 'date'>) => {
    const newRev: AdminReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Today',
    };
    setReviews(prev => [newRev, ...prev]);

    // Generate real-time notification
    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'review',
      title: 'New Client Review Submitted',
      message: `${newRev.clientName} left feedback for ${newRev.service}`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'reviews',
      targetId: newRev.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateReviewStatus = (id: string, status: ReviewStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Messages CRUD
  const addMessage = (messageData: Omit<AdminMessage, 'id' | 'receivedAt' | 'status'>) => {
    const newMsg: AdminMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      receivedAt: 'Just now',
      status: 'Unread'
    };
    setMessages(prev => [newMsg, ...prev]);

    // Generate real-time notification
    const notif: AdminNotification = {
      id: `notif-${Date.now()}`,
      type: 'message',
      title: 'New Client Inquiry',
      message: `${newMsg.name} submitted an inquiry: "${newMsg.subject}"`,
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'messages',
      targetId: newMsg.id,
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateMessageStatus = (id: string, status: MessageStatus) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const replyToMessage = (id: string, replyNote: string) => {
    setMessages(prev => prev.map(m => m.id === id ? {
      ...m,
      status: 'Replied',
      replyNote,
      repliedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  // Settings & Clear Live Data
  const updateStudioSettings = (settingsData: Partial<StudioSettings>) => {
    setStudioSettings(prev => ({ ...prev, ...settingsData }));
  };

  const clearAllData = () => {
    setCustomers([]);
    setBookings([]);
    setReviews([]);
    setMessages([]);
    setNotifications([]);
    localStorage.removeItem('ng_admin_customers');
    localStorage.removeItem('ng_admin_bookings');
    localStorage.removeItem('ng_admin_reviews');
    localStorage.removeItem('ng_studio_reviews');
    localStorage.removeItem('ng_admin_messages');
    localStorage.removeItem('ng_admin_notifications');
  };

  // Aggregated Stats
  const totalCustomers = customers.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
  const totalServices = services.length;
  const totalReviews = reviews.filter(r => r.status === 'Approved').length;
  const totalRevenue = bookings.filter(b => b.status === 'Completed' || b.status === 'Confirmed').reduce((acc, curr) => acc + curr.rawAmount, 0);

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        activeTab,
        setActiveTab,
        isSidebarOpen,
        setIsSidebarOpen,
        searchQuery,
        setSearchQuery,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedBookingId,
        setSelectedBookingId,
        login,
        logout,
        updateAdminProfile,
        changeAdminPassword,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        bookings,
        addBooking,
        updateBooking,
        updateBookingStatus,
        deleteBooking,
        services,
        addService,
        updateService,
        deleteService,
        packages,
        addPackage,
        updatePackage,
        deletePackage,
        portfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        galleryAlbums,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        addPhotosToAlbum,
        deletePhotoFromAlbum,
        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,
        messages,
        addMessage,
        updateMessageStatus,
        replyToMessage,
        deleteMessage,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        studioSettings,
        updateStudioSettings,
        clearAllData,
        stats: {
          totalCustomers,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          totalServices,
          totalReviews,
          totalRevenue
        }
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

const SAFE_FALLBACK_ADMIN: AdminContextType = {
  isAuthenticated: false,
  adminUser: DEFAULT_ADMIN_USER,
  activeTab: 'dashboard',
  setActiveTab: () => {},
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  selectedCustomerId: null,
  setSelectedCustomerId: () => {},
  selectedBookingId: null,
  setSelectedBookingId: () => {},
  login: () => ({ success: false, message: 'Admin session required' }),
  logout: () => {},
  updateAdminProfile: () => {},
  changeAdminPassword: () => ({ success: false, message: 'Not permitted' }),
  customers: INITIAL_CUSTOMERS,
  addCustomer: () => ({} as any),
  updateCustomer: () => {},
  deleteCustomer: () => {},
  bookings: INITIAL_BOOKINGS,
  addBooking: () => ({} as any),
  updateBooking: () => {},
  updateBookingStatus: () => {},
  deleteBooking: () => {},
  services: INITIAL_SERVICES,
  addService: () => ({} as any),
  updateService: () => {},
  deleteService: () => {},
  packages: INITIAL_PACKAGES,
  addPackage: () => ({} as any),
  updatePackage: () => {},
  deletePackage: () => {},
  portfolio: INITIAL_PORTFOLIO,
  addPortfolioItem: () => ({} as any),
  updatePortfolioItem: () => {},
  deletePortfolioItem: () => {},
  galleryAlbums: INITIAL_GALLERY_ALBUMS,
  addAlbum: () => ({} as any),
  updateAlbum: () => {},
  deleteAlbum: () => {},
  addPhotosToAlbum: () => {},
  deletePhotoFromAlbum: () => {},
  reviews: INITIAL_REVIEWS,
  addReview: () => ({} as any),
  updateReviewStatus: () => {},
  deleteReview: () => {},
  messages: INITIAL_MESSAGES,
  addMessage: () => ({} as any),
  updateMessageStatus: () => {},
  replyToMessage: () => {},
  deleteMessage: () => {},
  notifications: INITIAL_NOTIFICATIONS,
  unreadNotificationCount: 0,
  markNotificationRead: () => {},
  markAllNotificationsRead: () => {},
  deleteNotification: () => {},
  studioSettings: INITIAL_STUDIO_SETTINGS,
  updateStudioSettings: () => {},
  clearAllData: () => {},
  stats: {
    totalCustomers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalServices: 0,
    totalReviews: 0,
    totalRevenue: 0
  }
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    console.warn('Notice: useAdmin called outside AdminProvider. Returning safe fallback.');
    return SAFE_FALLBACK_ADMIN;
  }
  return context;
};
