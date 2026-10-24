// ==========================================================
// NG DIGITAL STUDIO - Admin Panel REST API Service Client
// Communicates with Node.js/Express & MySQL Backend API
// ==========================================================

const API_BASE_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || '/api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  notes?: string;
  createdAt: string;
  totalBookings?: number;
  bookings?: Booking[];
}

export interface Booking {
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
  eventReason: string;
  expectations: string;
  amount: number;
  advanceAmount: number;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageItem {
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

export interface GalleryItem {
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

export interface ReviewItem {
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

export interface DashboardStats {
  totalCustomers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalPackages: number;
  totalReviews: number;
  recentBookings: Booking[];
  recentCustomers: Customer[];
}

export interface MonthlyBookingStatusBreakdown {
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  rejected: number;
}

export interface MonthlyBookingRecord {
  month: string;
  label: string;
  bookingCount: number;
  statusBreakdown: MonthlyBookingStatusBreakdown;
}

export interface MonthlyRevenueRecord {
  month: string;
  label: string;
  confirmedBookingValue: number;
  confirmedBookingsCount: number;
  averageBookingValue: number;
}

export interface ComparisonMonthData {
  month: string;
  label: string;
  bookingCount: number;
  confirmedBookingValue: number;
  confirmedCount: number;
  pendingCount: number;
  completedCount: number;
}

export interface TwoMonthComparisonData {
  monthA: ComparisonMonthData;
  monthB: ComparisonMonthData;
  differences: {
    bookingCountDiff: number;
    absoluteBookingDiff: number;
    bookingPercentageChange: number | null;
    bookingHigher: 'Month A' | 'Month B' | 'Equal';
    revenueDiff: number;
    absoluteRevenueDiff: number;
    revenuePercentageChange: number | null;
    revenueHigher: 'Month A' | 'Month B' | 'Equal';
  };
}

export interface ExcludedRecordInfo {
  id: string;
  customerName?: string;
  reason: string;
}

export interface DataValidationSummary {
  totalScanned: number;
  validRecordsCount: number;
  duplicateIdCount: number;
  invalidFieldsCount: number;
  excludedCount: number;
  statusBreakdown: MonthlyBookingStatusBreakdown;
  excludedRecords: ExcludedRecordInfo[];
}

export interface StudioAnalyticsData {
  success: boolean;
  availableMonths: { month: string; label: string }[];
  monthlyBookingAnalysis: {
    records: MonthlyBookingRecord[];
    totalBookings: number;
    statusTotals: MonthlyBookingStatusBreakdown;
  };
  monthlyRevenueAnalysis: {
    records: MonthlyRevenueRecord[];
    totalConfirmedBookingValue: number;
    revenueMetricLabel: string;
    paymentRecordsAvailable: boolean;
    explanation: string;
  };
  twoMonthComparison: TwoMonthComparisonData | null;
  validationSummary: DataValidationSummary;
}

// Helper to get auth headers from stored session token
function getAuthHeaders(): HeadersInit {
  const token = sessionStorage.getItem('ng_admin_token') || localStorage.getItem('ng_admin_token') || '';
  const email = sessionStorage.getItem('ng_admin_email') || localStorage.getItem('ng_admin_email') || 'admin@ngdigitalstudio.com';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-admin-token': token,
    'x-admin-email': email
  };
}

export const api = {
  // Studio Analytics (Monthly Bookings, Monthly Revenue, Two-Month Comparison)
  async getStudioAnalytics(monthA?: string, monthB?: string): Promise<StudioAnalyticsData> {
    const params = new URLSearchParams();
    if (monthA) params.set('monthA', monthA);
    if (monthB) params.set('monthB', monthB);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE_URL}/analytics${queryString}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch studio analytics`);
    const json = await res.json();
    return json;
  },

  async seedDemoAnalytics(): Promise<{ message: string; count: number }> {
    const res = await fetch(`${API_BASE_URL}/analytics/seed-demo`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to seed demo analytics data');
    return res.json();
  },

  async clearDemoAnalytics(): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/analytics/clear`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear analytics bookings');
    return res.json();
  },

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch dashboard stats`);
    const json = await res.json();
    return json.data;
  },

  // Customers
  async getCustomers(query?: string): Promise<Customer[]> {
    const url = query ? `${API_BASE_URL}/customers?q=${encodeURIComponent(query)}` : `${API_BASE_URL}/customers`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch customers');
    const json = await res.json();
    return json.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch customer details');
    const json = await res.json();
    return json.data;
  },

  async createCustomer(data: { name: string; email: string; phone?: string; city?: string; address?: string; notes?: string }): Promise<Customer> {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create customer');
    const json = await res.json();
    return json.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete customer');
  },

  async deduplicateCustomers(): Promise<{ removed: number; remaining: number }> {
    const res = await fetch(`${API_BASE_URL}/customers/deduplicate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to deduplicate customers');
    const json = await res.json();
    return json.data;
  },

  async clearAllCustomers(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/customers?confirm=true`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear customer records');
  },

  // Bookings
  async getBookings(status?: string): Promise<Booking[]> {
    const url = status && status !== 'All' 
      ? `${API_BASE_URL}/bookings?status=${encodeURIComponent(status)}` 
      : `${API_BASE_URL}/bookings`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    const json = await res.json();
    return json.data;
  },

  async confirmBooking(id: string, adminNotes?: string): Promise<{ success: boolean; message: string; data: Booking }> {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/confirm`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ adminNotes })
    });
    if (!res.ok) throw new Error('Failed to confirm booking');
    return res.json();
  },

  async rejectBooking(id: string, reason: string, adminNotes?: string): Promise<{ success: boolean; message: string; data: Booking }> {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason, adminNotes })
    });
    if (!res.ok) throw new Error('Failed to reject booking');
    return res.json();
  },

  async updateBookingStatus(id: string, status: string, adminNotes?: string): Promise<Booking> {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes })
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    const json = await res.json();
    return json.data;
  },

  async deleteBooking(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete booking');
  },

  async deduplicateBookings(): Promise<{ removed: number; remaining: number }> {
    const res = await fetch(`${API_BASE_URL}/bookings/deduplicate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to deduplicate bookings');
    const json = await res.json();
    return json.data;
  },

  async clearAllBookings(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/bookings?confirm=true`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to clear bookings');
  },

  // Packages
  async getPackages(): Promise<PackageItem[]> {
    const res = await fetch(`${API_BASE_URL}/packages`);
    if (!res.ok) throw new Error('Failed to fetch packages');
    const json = await res.json();
    return json.data;
  },

  async createPackage(data: Omit<PackageItem, 'id'>): Promise<PackageItem> {
    const res = await fetch(`${API_BASE_URL}/packages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create package');
    const json = await res.json();
    return json.data;
  },

  async updatePackage(id: string, updates: Partial<PackageItem>): Promise<PackageItem> {
    const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update package');
    const json = await res.json();
    return json.data;
  },

  async deletePackage(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete package');
  },

  // Gallery
  async getGallery(category?: string): Promise<GalleryItem[]> {
    const url = category && category !== 'All' 
      ? `${API_BASE_URL}/gallery?category=${encodeURIComponent(category)}` 
      : `${API_BASE_URL}/gallery`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch gallery items');
    const json = await res.json();
    return json.data;
  },

  async addGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
    const res = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to add gallery photo');
    const json = await res.json();
    return json.data;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete gallery image');
  },

  // Reviews
  async getReviews(status?: string): Promise<ReviewItem[]> {
    const url = status && status !== 'All' 
      ? `${API_BASE_URL}/reviews?status=${encodeURIComponent(status)}` 
      : `${API_BASE_URL}/reviews`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to fetch reviews');
    const json = await res.json();
    return json.data;
  },

  async approveReview(id: string): Promise<ReviewItem> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to approve review');
    const json = await res.json();
    return json.data;
  },

  async rejectReview(id: string): Promise<ReviewItem> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reject review');
    const json = await res.json();
    return json.data;
  },

  async deleteReview(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete review');
  }
};
