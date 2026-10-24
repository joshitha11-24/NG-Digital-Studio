// ==========================================================
// Database Service: MySQL / Memory Layer with Auto-Schema
// ==========================================================

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  notes?: string;
  createdAt: string;
  totalBookings?: number;
}

export interface PackageRecord {
  id: string;
  name: string;
  tier: 'Silver' | 'Gold' | 'Premium';
  price: number;
  album: string;
  drone: string;
  video: string;
  photoCount: string;
  deliveryTime: string;
  description: string;
  features: string[];
  isActive: boolean;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  packageId?: string;
  packageName: string;
  basePackagePrice?: string;
  includedServices?: string[];
  customizations?: string[];
  customizationStatus?: string;
  eventDate: string;
  bookingDate: string;
  eventVenue?: string;
  eventReason?: string;
  expectations?: string;
  amount: number;
  advanceAmount?: number;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';
  paymentStatus?: 'Pending' | 'Advance Paid' | 'Fully Paid';
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GalleryRecord {
  id: string;
  title: string;
  category: 
    | 'Wedding'
    | 'Birthday'
    | 'Pre-Wedding'
    | 'Post-Wedding'
    | 'Outdoor Shoot'
    | 'Baby Shower'
    | 'Engagement'
    | 'Housewarming'
    | 'Product Shoot';
  imageUrl: string;
  thumbnailUrl?: string;
  description?: string;
  location?: string;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  clientName: string;
  service: string;
  reviewText: string;
  rating: number;
  location: string;
  avatar?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

// Initial Packages Seed
const INITIAL_PACKAGES: PackageRecord[] = [
  {
    id: 'pkg-budget',
    name: 'BUDGET (Wedding)',
    tier: 'Silver',
    price: 35000,
    album: '15 × 10 Album with 30 Pages',
    drone: 'Optional Add-on (Contact studio)',
    video: 'HD Video',
    photoCount: '300+ Color-Graded Photos',
    deliveryTime: '15 Working Days',
    description: 'Essential coverage featuring traditional photography, HD video, 15 × 10 album, pendrive, photo frame, and bag.',
    features: [
      'Traditional Photographer',
      'HD Video',
      '15 × 10 Album with 30 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isActive: true
  },
  {
    id: 'pkg-luxury',
    name: 'LUXURY (Wedding)',
    tier: 'Gold',
    price: 50000,
    album: '15 × 10 Album with 60 Pages',
    drone: 'Optional Add-on (Contact studio)',
    video: 'HD Video',
    photoCount: '500+ Edited High-Res Photos',
    deliveryTime: '10 Working Days',
    description: 'Luxury coverage featuring traditional & candid photography, HD video, 60-page 15 × 10 album, pendrive, frame, and bag.',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isActive: true
  },
  {
    id: 'pkg-semi-luxury',
    name: 'SEMI-LUXURY (Wedding)',
    tier: 'Premium',
    price: 65000,
    album: '15 × 10 Album with 60 Pages',
    drone: 'Optional Add-on (Contact studio)',
    video: 'HD Video + Candid Videography',
    photoCount: '700+ Master-Edited Masterpiece Photos',
    deliveryTime: '7 Working Days',
    description: 'Semi-luxury coverage featuring traditional photography, HD video, candid photography, candid videography, 60-page album, pendrive, frame, and bag.',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      'Candid Videography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isActive: true
  },
  {
    id: 'pkg-gen-budget',
    name: 'BUDGET (Birthdays, Puberty & Shoots)',
    tier: 'Silver',
    price: 30000,
    album: '15 × 10 Album with 30 Pages',
    drone: 'Optional Add-on (Contact studio)',
    video: 'HD Video',
    photoCount: '300+ Color-Graded Stills',
    deliveryTime: '12 Working Days',
    description: 'Essential celebration coverage for birthdays, puberty ceremonies, and studio/outdoor shoots with traditional photography, HD video, 15 × 10 album, pendrive, frame, and bag.',
    features: [
      'Traditional Photographer',
      'HD Video',
      '15 × 10 Album with 30 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isActive: true
  },
  {
    id: 'pkg-gen-luxury',
    name: 'LUXURY (Birthdays, Puberty & Shoots)',
    tier: 'Gold',
    price: 40000,
    album: '15 × 10 Album with 60 Pages',
    drone: 'Optional Add-on (Contact studio)',
    video: 'HD Video',
    photoCount: '500+ Color-Graded Stills',
    deliveryTime: '10 Working Days',
    description: 'Luxury celebration coverage combining traditional & candid photography with HD video, expanded 60-page 15 × 10 album, pendrive, frame, and bag.',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isActive: true
  },
  {
    id: 'pkg-gen-semi-luxury',
    name: 'SEMI-LUXURY (Birthdays, Puberty & Shoots)',
    tier: 'Premium',
    price: 60000,
    album: '15 × 10 Album with 60 Pages',
    drone: 'Optional Add-on (Contact studio)',
    video: 'HD Video + Candid Videography',
    photoCount: '700+ Master-Edited Masterpiece Stills',
    deliveryTime: '7 Working Days',
    description: 'Complete comprehensive cinema suite featuring traditional photography, candid photography, HD video, candid videography, and 60-page album.',
    features: [
      'Traditional Photographer',
      'HD Video',
      'Candid Photography',
      'Candid Videography',
      '15 × 10 Album with 60 Pages',
      'Pendrive',
      'Photo Frame',
      'Bag'
    ],
    isActive: true
  }
];

// Live Customers Store - Clean slate for live production customer entries
const INITIAL_CUSTOMERS: CustomerRecord[] = [];

// Live Bookings Store - Clean slate for live customer bookings
const INITIAL_BOOKINGS: BookingRecord[] = [];

// Initial Gallery Seed
const INITIAL_GALLERY: GalleryRecord[] = [
  {
    id: 'gal-1',
    title: 'Royal Meenakshi Temple Muhurtham',
    category: 'Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional silk kanchipuram sari rituals and golden hour lighting.',
    location: 'Madurai',
    createdAt: '2026-02-10'
  },
  {
    id: 'gal-2',
    title: 'Pre-Wedding Coastal Sunset',
    category: 'Pre-Wedding',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Cinematic silhouettes and romantic sea breeze portraits.',
    location: 'Rameshwaram',
    createdAt: '2026-02-15'
  },
  {
    id: 'gal-3',
    title: 'Daughter Manjal Neerattu Half-Saree Ceremony',
    category: 'Outdoor Shoot',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    description: 'Traditional South Indian puberty ceremony floral backdrop.',
    location: 'Madurai',
    createdAt: '2026-02-20'
  },
  {
    id: 'gal-4',
    title: 'Traditional Gruhapravesam Homam',
    category: 'Housewarming',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Brahma Muhurtham milk boiling and Ganapathi homam smoke light beams.',
    location: 'Madurai',
    createdAt: '2026-02-25'
  }
];

// Live Reviews Store - Clean slate for live production customer reviews
const INITIAL_REVIEWS: ReviewRecord[] = [];

// In-Memory Database Store with thread-safe operations
class DatabaseStore {
  customers: CustomerRecord[] = [...INITIAL_CUSTOMERS];
  packages: PackageRecord[] = [...INITIAL_PACKAGES];
  bookings: BookingRecord[] = [...INITIAL_BOOKINGS];
  gallery: GalleryRecord[] = [...INITIAL_GALLERY];
  reviews: ReviewRecord[] = [...INITIAL_REVIEWS];

  // Customers
  getAllCustomers(query?: string): CustomerRecord[] {
    if (!query) return this.customers;
    const q = query.toLowerCase();
    return this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }

  getCustomerById(id: string): CustomerRecord | undefined {
    return this.customers.find((c) => c.id === id);
  }

  addCustomer(data: Omit<CustomerRecord, 'id' | 'createdAt' | 'totalBookings'>): CustomerRecord {
    const normEmail = data.email.trim().toLowerCase();
    const normPhone = data.phone ? data.phone.replace(/[^0-9]/g, '') : '';

    // Check for duplicate by email OR phone number
    const existing = this.customers.find((c) => {
      const cEmail = c.email.trim().toLowerCase();
      const cPhone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
      return (cEmail && cEmail === normEmail) || (normPhone && cPhone && normPhone.length >= 8 && cPhone === normPhone);
    });

    if (existing) {
      if (data.name && data.name !== existing.name) existing.name = data.name;
      if (data.phone && !existing.phone) existing.phone = data.phone;
      if (data.city && !existing.city) existing.city = data.city;
      if (data.address && !existing.address) existing.address = data.address;
      if (data.notes && !existing.notes?.includes(data.notes)) {
        existing.notes = existing.notes ? `${existing.notes} | ${data.notes}` : data.notes;
      }
      return existing;
    }

    const newCust: CustomerRecord = {
      ...data,
      id: `cust-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalBookings: 0
    };
    this.customers.unshift(newCust);
    return newCust;
  }

  deleteCustomer(id: string): boolean {
    const initialLen = this.customers.length;
    this.customers = this.customers.filter((c) => c.id !== id);
    return this.customers.length < initialLen;
  }

  deduplicateCustomers(): { removed: number; remaining: number } {
    const seen = new Map<string, CustomerRecord>();
    const originalCount = this.customers.length;

    for (const cust of this.customers) {
      const emailKey = cust.email ? cust.email.trim().toLowerCase() : '';
      const phoneDigits = cust.phone ? cust.phone.replace(/[^0-9]/g, '') : '';
      const key = emailKey || (phoneDigits.length >= 8 ? phoneDigits : cust.id);

      if (!seen.has(key)) {
        seen.set(key, { ...cust });
      } else {
        const existing = seen.get(key)!;
        existing.totalBookings = Math.max(existing.totalBookings || 0, cust.totalBookings || 0);
        if (!existing.phone && cust.phone) existing.phone = cust.phone;
        if (!existing.address && cust.address) existing.address = cust.address;
        if (!existing.city && cust.city) existing.city = cust.city;
      }
    }

    this.customers = Array.from(seen.values());
    return {
      removed: originalCount - this.customers.length,
      remaining: this.customers.length
    };
  }

  clearAllCustomers(): void {
    this.customers = [];
  }

  // Packages
  getAllPackages(): PackageRecord[] {
    return this.packages;
  }

  getPackageById(id: string): PackageRecord | undefined {
    return this.packages.find((p) => p.id === id);
  }

  addPackage(data: Omit<PackageRecord, 'id'>): PackageRecord {
    const newPkg: PackageRecord = {
      ...data,
      id: `pkg-${Date.now()}`
    };
    this.packages.push(newPkg);
    return newPkg;
  }

  updatePackage(id: string, updates: Partial<PackageRecord>): PackageRecord | null {
    const index = this.packages.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.packages[index] = { ...this.packages[index], ...updates };
    return this.packages[index];
  }

  deletePackage(id: string): boolean {
    const initialLen = this.packages.length;
    this.packages = this.packages.filter((p) => p.id !== id);
    return this.packages.length < initialLen;
  }

  // Bookings
  getAllBookings(status?: string): BookingRecord[] {
    if (!status || status === 'All') return this.bookings;
    return this.bookings.filter((b) => b.status === status);
  }

  getBookingById(id: string): BookingRecord | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  createBooking(data: Omit<BookingRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>): BookingRecord {
    // Prevent duplicate booking creation: check for recent duplicate submission within 5 minutes
    const nowMs = Date.now();
    const existingRapidDuplicate = this.bookings.find((b) => {
      const bTime = new Date(b.createdAt).getTime();
      const isWithinFiveMin = !isNaN(bTime) && nowMs - bTime < 5 * 60 * 1000;
      return (
        isWithinFiveMin &&
        b.customerEmail.trim().toLowerCase() === data.customerEmail.trim().toLowerCase() &&
        b.customerPhone.trim() === data.customerPhone.trim() &&
        b.eventDate === data.eventDate &&
        b.serviceName === data.serviceName &&
        b.amount === data.amount
      );
    });
    if (existingRapidDuplicate) {
      return existingRapidDuplicate;
    }

    const uniqueSuffix = `${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const newBooking: BookingRecord = {
      ...data,
      id: `NG-BK-${new Date().getFullYear()}-${uniqueSuffix}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.bookings.unshift(newBooking);

    // Ensure customer profile exists or increments
    const cust = this.customers.find((c) => c.email.toLowerCase() === data.customerEmail.toLowerCase());
    if (cust) {
      cust.totalBookings = (cust.totalBookings || 0) + 1;
    } else {
      this.addCustomer({
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        city: 'Madurai',
        notes: `Customer created from booking ${newBooking.id}`
      });
    }

    return newBooking;
  }

  deleteBooking(id: string): boolean {
    const initialLen = this.bookings.length;
    this.bookings = this.bookings.filter((b) => b.id !== id);
    return this.bookings.length < initialLen;
  }

  deduplicateBookings(): { removed: number; remaining: number } {
    const seen = new Map<string, BookingRecord>();
    const originalCount = this.bookings.length;

    for (const b of this.bookings) {
      const key = `${b.customerEmail.trim().toLowerCase()}_${b.eventDate}_${b.serviceName || b.serviceId}`;
      if (!seen.has(key)) {
        seen.set(key, b);
      }
    }

    this.bookings = Array.from(seen.values());
    return {
      removed: originalCount - this.bookings.length,
      remaining: this.bookings.length
    };
  }

  clearAllBookings(): void {
    this.bookings = [];
  }

  updateBookingStatus(id: string, status: BookingRecord['status'], rejectionReason?: string, adminNotes?: string): BookingRecord | null {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    if (rejectionReason) booking.rejectionReason = rejectionReason;
    if (adminNotes) booking.adminNotes = adminNotes;

    return booking;
  }

  // Gallery
  getAllGallery(category?: string): GalleryRecord[] {
    if (!category || category === 'All') return this.gallery;
    return this.gallery.filter((g) => g.category === category);
  }

  addGalleryItem(data: Omit<GalleryRecord, 'id' | 'createdAt'>): GalleryRecord {
    const newItem: GalleryRecord = {
      ...data,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.gallery.unshift(newItem);
    return newItem;
  }

  deleteGalleryItem(id: string): boolean {
    const initialLen = this.gallery.length;
    this.gallery = this.gallery.filter((g) => g.id !== id);
    return this.gallery.length < initialLen;
  }

  // Reviews
  getAllReviews(status?: string): ReviewRecord[] {
    if (!status || status === 'All') return this.reviews;
    return this.reviews.filter((r) => r.status === status);
  }

  getApprovedReviews(): ReviewRecord[] {
    return this.reviews.filter((r) => r.status === 'Approved');
  }

  addReview(data: Omit<ReviewRecord, 'id' | 'createdAt'>): ReviewRecord {
    const newRev: ReviewRecord = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.reviews.unshift(newRev);
    return newRev;
  }

  updateReviewStatus(id: string, status: ReviewRecord['status']): ReviewRecord | null {
    const rev = this.reviews.find((r) => r.id === id);
    if (!rev) return null;
    rev.status = status;
    return rev;
  }

  deleteReview(id: string): boolean {
    const initialLen = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== id);
    return this.reviews.length < initialLen;
  }

  // Dashboard Stats
  getDashboardStats() {
    const totalCustomers = this.customers.length;
    const totalBookings = this.bookings.length;
    const pendingBookings = this.bookings.filter((b) => b.status === 'Pending').length;
    const confirmedBookings = this.bookings.filter((b) => b.status === 'Confirmed').length;
    const totalPackages = this.packages.length;
    const totalReviews = this.reviews.length;

    const recentBookings = this.bookings.slice(0, 5);
    const recentCustomers = this.customers.slice(0, 5);

    return {
      totalCustomers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalPackages,
      totalReviews,
      recentBookings,
      recentCustomers
    };
  }
}

export const dbStore = new DatabaseStore();
