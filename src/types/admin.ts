export type AdminTab = 
  | 'dashboard'
  | 'customers'
  | 'bookings'
  | 'services'
  | 'packages'
  | 'portfolio'
  | 'gallery'
  | 'reviews'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'settings';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type CustomerStatus = 'Active' | 'Inactive';
export type ServiceStatus = 'Active' | 'Inactive';
export type PackageStatus = 'Active' | 'Inactive';
export type PortfolioStatus = 'Published' | 'Draft';
export type ReviewStatus = 'Approved' | 'Pending' | 'Rejected' | 'Hidden';
export type MessageStatus = 'Unread' | 'Read' | 'Replied';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  lastLogin: string;
}

export interface AdminCustomer {
  id: string;
  customerId: string; // e.g. CUST-0101
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registrationDate: string;
  totalBookings: number;
  totalSpent: string;
  rawTotalSpent: number;
  status: CustomerStatus;
  location: string;
  notes?: string;
}

export interface AdminBooking {
  id: string;
  bookingId: string; // e.g. NG001
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar?: string;
  service: string;
  package: string;
  basePackagePrice?: string;
  includedServices?: string[];
  customizations?: string[];
  customizationStatus?: string;
  eventDate: string;
  sessionTime?: string;
  venue: string;
  amount: string;
  rawAmount: number;
  status: BookingStatus;
  specialNotes?: string;
  createdDate: string;
}

export interface AdminService {
  id: string;
  title: string;
  category: string;
  startingPrice: string;
  description: string;
  imageUrl: string;
  features: string[];
  isActive: boolean;
  totalBookings: number;
}

export interface AdminPackage {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  duration: string;
  serviceCategory: string;
  features: string[];
  isPopular?: boolean;
}

export interface AdminPortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  clientName?: string;
  location?: string;
  uploadDate: string;
  isFeatured?: boolean;
  views?: number;
}

export interface AdminGalleryAlbum {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  photoCount: number;
  createdDate: string;
  description: string;
  photos: {
    id: string;
    url: string;
    caption: string;
    uploadedAt: string;
  }[];
}

export interface AdminReview {
  id: string;
  clientName: string;
  avatar: string;
  service: string;
  rating?: number;
  reviewText: string;
  date: string;
  status: ReviewStatus;
  location?: string;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: MessageStatus;
  replyNote?: string;
  repliedAt?: string;
}

export interface AdminNotification {
  id: string;
  type: 'booking' | 'customer' | 'review' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetTab?: AdminTab;
  targetId?: string;
}

export interface StudioSettings {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  currencySymbol: string;
  autoConfirmBookings: boolean;
  notificationEmail: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
  };
}
