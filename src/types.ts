export type PageType = 
  | 'home' 
  | 'about' 
  | 'services' 
  | 'service-detail' 
  | 'portfolio' 
  | 'packages' 
  | 'gallery' 
  | 'reviews' 
  | 'contact' 
  | 'booking'
  | 'my-bookings';

export type GalleryCategory = 
  | 'All' 
  | 'Wedding' 
  | 'Birthday' 
  | 'Pre-Wedding' 
  | 'Outdoor' 
  | 'Puberty' 
  | 'Baby' 
  | 'Events' 
  | 'Product';

export interface ServiceItem {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  heroSubtitle: string;
  image: string;
  categoryTag: string;
  startingPrice: string;
  iconName: string;
  whatWeCapture: {
    title: string;
    description: string;
    image: string;
  }[];
  highlightVideoUrl?: string;
  featuredGallery: {
    id: string;
    url: string;
    title: string;
    tag: string;
  }[];
  includedHighlights: string[];
}

export interface PackageItem {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  price: string;
  rawPrice: number;
  category: string;
  description: string;
  photographers: string;
  albumDetails: string;
  videoCoverage: string;
  droneCoverage: string;
  photoCount: string;
  deliveryTime: string;
  otherServices: string[];
  features: string[];
}

export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: GalleryCategory;
  date?: string;
  featured?: boolean;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
  location?: string;
  description?: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  eventType: string;
  date: string;
  rating: number;
  review: string;
  customerImage?: string;
  eventImage?: string;
  location?: string;
  verified: boolean;
}

export interface BookingData {
  bookingId: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  eventType: string;
  eventDate: string;
  eventVenue: string;
  selectedService: string;
  selectedPackage: string;
  basePackagePrice?: string;
  includedServices?: string[];
  customizations?: string[];
  customizationStatus?: string;
  photographyPreference: 'Traditional & Candid' | 'Candid Exclusive' | 'Cinematic Film' | 'Full Studio Experience';
  specialRequirements: string;
  additionalNotes: string;
  totalEstimatedPrice: string;
  createdAt: string;
  status: 'Confirmed' | 'Reviewing' | 'Scheduled' | 'Pending' | 'Rejected' | 'Completed' | 'Cancelled';
}

export interface UserAccount {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  emailVerified?: boolean;
  role?: 'customer' | 'admin';
}
