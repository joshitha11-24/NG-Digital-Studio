import { Router, Request, Response } from 'express';
import { dbStore, BookingRecord } from '../config/db';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// Valid booking status list
const VALID_STATUSES: BookingRecord['status'][] = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
  'Rejected'
];

// Helper to format YYYY-MM into readable month label
function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-');
  if (!year || !month) return ym;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mIdx = parseInt(month, 10) - 1;
  return `${monthNames[mIdx] || month} ${year}`;
}

// Interface for cleaned and validated booking
export interface ValidatedBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  packageName: string;
  creationMonth: string; // YYYY-MM based on booking creation date
  eventDate: string;
  amount: number;
  status: BookingRecord['status'];
  paymentStatus?: string;
  isConfirmedOrCompleted: boolean;
  createdAt: string;
}

export interface ExcludedRecordInfo {
  id: string;
  customerName?: string;
  reason: string;
  rawData?: Partial<BookingRecord>;
}

export interface ValidationSummary {
  totalScanned: number;
  validRecordsCount: number;
  duplicateIdCount: number;
  invalidFieldsCount: number;
  excludedCount: number;
  statusBreakdown: {
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
    rejected: number;
  };
  excludedRecords: ExcludedRecordInfo[];
}

export interface MonthlyBookingItem {
  month: string;       // YYYY-MM
  label: string;       // "Oct 2025"
  bookingCount: number;
  statusBreakdown: {
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
    rejected: number;
  };
}

export interface MonthlyRevenueItem {
  month: string;       // YYYY-MM
  label: string;       // "Oct 2025"
  confirmedBookingValue: number;
  confirmedBookingsCount: number;
  averageBookingValue: number;
}

export interface TwoMonthComparisonResult {
  monthA: {
    month: string;
    label: string;
    bookingCount: number;
    confirmedBookingValue: number;
    confirmedCount: number;
    pendingCount: number;
    completedCount: number;
  };
  monthB: {
    month: string;
    label: string;
    bookingCount: number;
    confirmedBookingValue: number;
    confirmedCount: number;
    pendingCount: number;
    completedCount: number;
  };
  differences: {
    bookingCountDiff: number;          // Month B - Month A
    absoluteBookingDiff: number;       // |Month B - Month A|
    bookingPercentageChange: number | null;
    bookingHigher: 'Month A' | 'Month B' | 'Equal';
    revenueDiff: number;               // Month B - Month A
    absoluteRevenueDiff: number;       // |Month B - Month A|
    revenuePercentageChange: number | null;
    revenueHigher: 'Month A' | 'Month B' | 'Equal';
  };
}

/**
 * Data Cleaning & Validation Function
 * - Scans real database records
 * - Checks for duplicate booking IDs
 * - Validates required fields, dates, booking statuses, and prices
 * - Does NOT classify bookings as duplicates based only on customer name, event date, and package
 * - Leaves original database records completely unchanged
 */
function cleanAndValidateBookings(records: BookingRecord[]): {
  validBookings: ValidatedBooking[];
  validationSummary: ValidationSummary;
} {
  const seenIds = new Set<string>();
  const validBookings: ValidatedBooking[] = [];
  const excludedRecords: ExcludedRecordInfo[] = [];

  let duplicateIdCount = 0;
  let invalidFieldsCount = 0;

  const statusBreakdown = {
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0
  };

  for (const record of records) {
    // 1. Check for missing or duplicate booking ID
    if (!record.id || typeof record.id !== 'string' || record.id.trim() === '') {
      invalidFieldsCount++;
      excludedRecords.push({
        id: record.id || 'MISSING_ID',
        customerName: record.customerName || 'Unknown',
        reason: 'Missing or empty booking ID'
      });
      continue;
    }

    const trimmedId = record.id.trim();
    if (seenIds.has(trimmedId)) {
      duplicateIdCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: record.customerName || 'Unknown',
        reason: `Duplicate booking ID "${trimmedId}" detected in database`
      });
      continue;
    }
    seenIds.add(trimmedId);

    // 2. Validate required fields
    if (!record.customerName || typeof record.customerName !== 'string' || record.customerName.trim() === '') {
      invalidFieldsCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: 'N/A',
        reason: 'Missing or empty customer name'
      });
      continue;
    }

    // 3. Validate Creation Date (used for Monthly Booking Analysis)
    // Preference: createdAt -> bookingDate -> eventDate
    const rawCreationDate = record.createdAt || record.bookingDate;
    if (!rawCreationDate) {
      invalidFieldsCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: record.customerName,
        reason: 'Missing booking creation date'
      });
      continue;
    }

    const creationDateObj = new Date(rawCreationDate);
    if (isNaN(creationDateObj.getTime())) {
      invalidFieldsCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: record.customerName,
        reason: `Invalid creation date format: "${rawCreationDate}"`
      });
      continue;
    }

    // Extract YYYY-MM
    let creationMonth = '';
    if (typeof rawCreationDate === 'string' && rawCreationDate.length >= 7) {
      creationMonth = rawCreationDate.slice(0, 7);
    } else {
      creationMonth = creationDateObj.toISOString().slice(0, 7);
    }

    if (!/^\d{4}-\d{2}$/.test(creationMonth)) {
      invalidFieldsCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: record.customerName,
        reason: `Could not parse year-month from creation date: "${rawCreationDate}"`
      });
      continue;
    }

    // 4. Validate Status
    const status = record.status || 'Pending';
    if (!VALID_STATUSES.includes(status)) {
      invalidFieldsCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: record.customerName,
        reason: `Invalid booking status: "${record.status}". Expected one of: ${VALID_STATUSES.join(', ')}`
      });
      continue;
    }

    // 5. Validate Price / Amount
    const amountNum = Number(record.amount);
    if (isNaN(amountNum) || amountNum < 0) {
      invalidFieldsCount++;
      excludedRecords.push({
        id: trimmedId,
        customerName: record.customerName,
        reason: `Invalid price/amount value: "${record.amount}". Must be non-negative number.`
      });
      continue;
    }

    // Record is valid!
    const isConfirmedOrCompleted = status === 'Confirmed' || status === 'Completed';

    if (status === 'Confirmed') statusBreakdown.confirmed++;
    else if (status === 'Pending') statusBreakdown.pending++;
    else if (status === 'Completed') statusBreakdown.completed++;
    else if (status === 'Cancelled') statusBreakdown.cancelled++;
    else if (status === 'Rejected') statusBreakdown.rejected++;

    validBookings.push({
      id: trimmedId,
      customerName: record.customerName.trim(),
      customerEmail: (record.customerEmail || '').trim(),
      customerPhone: (record.customerPhone || '').trim(),
      serviceName: record.serviceName || record.serviceId || 'Photography Session',
      packageName: record.packageName || 'Standard Package',
      creationMonth,
      eventDate: record.eventDate || creationDateObj.toISOString().split('T')[0],
      amount: amountNum,
      status,
      paymentStatus: record.paymentStatus,
      isConfirmedOrCompleted,
      createdAt: rawCreationDate
    });
  }

  return {
    validBookings,
    validationSummary: {
      totalScanned: records.length,
      validRecordsCount: validBookings.length,
      duplicateIdCount,
      invalidFieldsCount,
      excludedCount: excludedRecords.length,
      statusBreakdown,
      excludedRecords
    }
  };
}

// GET /api/analytics
router.get('/', requireAdminAuth, (req: Request, res: Response) => {
  try {
    // 1. Fetch raw booking records from current database without modifying them
    const rawRecords = [...dbStore.bookings];

    // 2. Perform non-destructive data validation and cleaning
    const { validBookings, validationSummary } = cleanAndValidateBookings(rawRecords);

    // Group valid bookings by booking creation month
    const monthMap = new Map<
      string,
      {
        totalCount: number;
        confirmed: number;
        pending: number;
        completed: number;
        cancelled: number;
        rejected: number;
        confirmedValue: number;
        confirmedCount: number;
      }
    >();

    for (const b of validBookings) {
      const ym = b.creationMonth;
      if (!monthMap.has(ym)) {
        monthMap.set(ym, {
          totalCount: 0,
          confirmed: 0,
          pending: 0,
          completed: 0,
          cancelled: 0,
          rejected: 0,
          confirmedValue: 0,
          confirmedCount: 0
        });
      }

      const mData = monthMap.get(ym)!;
      mData.totalCount += 1;

      if (b.status === 'Confirmed') mData.confirmed += 1;
      else if (b.status === 'Pending') mData.pending += 1;
      else if (b.status === 'Completed') mData.completed += 1;
      else if (b.status === 'Cancelled') mData.cancelled += 1;
      else if (b.status === 'Rejected') mData.rejected += 1;

      // FEATURE 2: Calculate monthly confirmed booking value based on confirmed bookings and their stored prices
      if (b.isConfirmedOrCompleted) {
        mData.confirmedValue += b.amount;
        mData.confirmedCount += 1;
      }
    }

    // Sort distinct months chronologically
    const sortedMonthKeys = Array.from(monthMap.keys()).sort();

    // ------------------------------------------------------------------------
    // FEATURE 1: MONTHLY BOOKING ANALYSIS
    // ------------------------------------------------------------------------
    const monthlyBookings: MonthlyBookingItem[] = sortedMonthKeys.map((ym) => {
      const entry = monthMap.get(ym)!;
      return {
        month: ym,
        label: formatMonthLabel(ym),
        bookingCount: entry.totalCount,
        statusBreakdown: {
          confirmed: entry.confirmed,
          pending: entry.pending,
          completed: entry.completed,
          cancelled: entry.cancelled,
          rejected: entry.rejected
        }
      };
    });

    const totalValidBookings = validBookings.length;

    // ------------------------------------------------------------------------
    // FEATURE 2: MONTHLY REVENUE ANALYSIS (Confirmed Booking Value)
    // ------------------------------------------------------------------------
    const monthlyRevenue: MonthlyRevenueItem[] = sortedMonthKeys.map((ym) => {
      const entry = monthMap.get(ym)!;
      return {
        month: ym,
        label: formatMonthLabel(ym),
        confirmedBookingValue: entry.confirmedValue,
        confirmedBookingsCount: entry.confirmedCount,
        averageBookingValue: entry.confirmedCount > 0 ? Math.round(entry.confirmedValue / entry.confirmedCount) : 0
      };
    });

    const totalConfirmedBookingValue = monthlyRevenue.reduce(
      (sum, item) => sum + item.confirmedBookingValue,
      0
    );

    // ------------------------------------------------------------------------
    // FEATURE 3: TWO-MONTH COMPARISON
    // ------------------------------------------------------------------------
    // Allow admin to select two months; default to the last two available months if not specified
    let selectedMonthA = (req.query.monthA as string) || '';
    let selectedMonthB = (req.query.monthB as string) || '';

    if (sortedMonthKeys.length >= 2) {
      if (!selectedMonthA || !sortedMonthKeys.includes(selectedMonthA)) {
        selectedMonthA = sortedMonthKeys[sortedMonthKeys.length - 2];
      }
      if (!selectedMonthB || !sortedMonthKeys.includes(selectedMonthB)) {
        selectedMonthB = sortedMonthKeys[sortedMonthKeys.length - 1];
      }
    } else if (sortedMonthKeys.length === 1) {
      selectedMonthA = sortedMonthKeys[0];
      selectedMonthB = sortedMonthKeys[0];
    }

    let comparison: TwoMonthComparisonResult | null = null;

    if (selectedMonthA && selectedMonthB) {
      const dataA = monthMap.get(selectedMonthA) || {
        totalCount: 0,
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        rejected: 0,
        confirmedValue: 0,
        confirmedCount: 0
      };

      const dataB = monthMap.get(selectedMonthB) || {
        totalCount: 0,
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        rejected: 0,
        confirmedValue: 0,
        confirmedCount: 0
      };

      const bookingDiff = dataB.totalCount - dataA.totalCount;
      const absoluteBookingDiff = Math.abs(bookingDiff);
      const bookingPercentageChange =
        dataA.totalCount > 0
          ? Math.round(((dataB.totalCount - dataA.totalCount) / dataA.totalCount) * 100)
          : null;

      const revenueDiff = dataB.confirmedValue - dataA.confirmedValue;
      const absoluteRevenueDiff = Math.abs(revenueDiff);
      const revenuePercentageChange =
        dataA.confirmedValue > 0
          ? Math.round(((dataB.confirmedValue - dataA.confirmedValue) / dataA.confirmedValue) * 100)
          : null;

      comparison = {
        monthA: {
          month: selectedMonthA,
          label: formatMonthLabel(selectedMonthA),
          bookingCount: dataA.totalCount,
          confirmedBookingValue: dataA.confirmedValue,
          confirmedCount: dataA.confirmed,
          pendingCount: dataA.pending,
          completedCount: dataA.completed
        },
        monthB: {
          month: selectedMonthB,
          label: formatMonthLabel(selectedMonthB),
          bookingCount: dataB.totalCount,
          confirmedBookingValue: dataB.confirmedValue,
          confirmedCount: dataB.confirmed,
          pendingCount: dataB.pending,
          completedCount: dataB.completed
        },
        differences: {
          bookingCountDiff: bookingDiff,
          absoluteBookingDiff,
          bookingPercentageChange,
          bookingHigher:
            dataB.totalCount > dataA.totalCount
              ? 'Month B'
              : dataB.totalCount < dataA.totalCount
              ? 'Month A'
              : 'Equal',
          revenueDiff,
          absoluteRevenueDiff,
          revenuePercentageChange,
          revenueHigher:
            dataB.confirmedValue > dataA.confirmedValue
              ? 'Month B'
              : dataB.confirmedValue < dataA.confirmedValue
              ? 'Month A'
              : 'Equal'
        }
      };
    }

    return res.json({
      success: true,
      availableMonths: sortedMonthKeys.map((ym) => ({
        month: ym,
        label: formatMonthLabel(ym)
      })),
      monthlyBookingAnalysis: {
        records: monthlyBookings,
        totalBookings: totalValidBookings,
        statusTotals: validationSummary.statusBreakdown
      },
      monthlyRevenueAnalysis: {
        records: monthlyRevenue,
        totalConfirmedBookingValue,
        revenueMetricLabel: 'Confirmed Booking Value',
        paymentRecordsAvailable: false,
        explanation:
          'Payment records are unavailable. Values represent monthly confirmed booking value based on confirmed bookings and their stored package prices.'
      },
      twoMonthComparison: comparison,
      validationSummary
    });
  } catch (error) {
    console.error('Data analytics calculation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process studio data analytics',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /api/analytics/seed-demo
// Seeds realistic studio bookings across recent months so the admin can test all three analytics features
router.post('/seed-demo', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const demoBookings: BookingRecord[] = [
      {
        id: 'BK-1001',
        customerName: 'Karthik & Deepa',
        customerEmail: 'karthik.deepa@example.com',
        customerPhone: '+91 98401 11223',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-luxury',
        packageName: 'Luxury Package',
        basePackagePrice: '₹50,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        customizations: ['Drone Photography', 'Pre-Wedding Shoot'],
        customizationStatus: 'Standard Package',
        eventDate: '2025-10-18',
        bookingDate: '2025-09-15',
        eventVenue: 'Raja Muthiah Mandapam, Madurai',
        amount: 50000,
        advanceAmount: 15000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-09-15T10:30:00.000Z'
      },
      {
        id: 'BK-1002',
        customerName: 'Praveen Kumar',
        customerEmail: 'praveen.k@example.com',
        customerPhone: '+91 94440 22334',
        serviceId: 'birthday-photography',
        serviceName: 'Birthday Photography',
        packageId: 'pkg-budget',
        packageName: 'Budget Package',
        basePackagePrice: '₹35,000',
        includedServices: ['Traditional Photographer', 'HD Video', '15 × 10 Album with 30 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-10-25',
        bookingDate: '2025-10-02',
        eventVenue: 'Fortune Pandiyan Hotel, Madurai',
        amount: 35000,
        advanceAmount: 10000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-10-02T11:00:00.000Z'
      },
      {
        id: 'BK-1003',
        customerName: 'Suresh & Anitha',
        customerEmail: 'suresh.anitha@example.com',
        customerPhone: '+91 97900 33445',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-semi-luxury',
        packageName: 'Semi-Luxury Package',
        basePackagePrice: '₹65,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', 'Candid Videography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-11-12',
        bookingDate: '2025-10-10',
        eventVenue: 'Vasantham Mahal, Madurai',
        amount: 65000,
        advanceAmount: 20000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-10-10T14:15:00.000Z'
      },
      {
        id: 'BK-1004',
        customerName: 'Meenakshi Sundaram',
        customerEmail: 'meenakshi.s@example.com',
        customerPhone: '+91 98412 44556',
        serviceId: 'engagement-photography',
        serviceName: 'Engagement Photography',
        packageId: 'pkg-budget',
        packageName: 'Budget Package',
        basePackagePrice: '₹35,000',
        includedServices: ['Traditional Photographer', 'HD Video', '15 × 10 Album with 30 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-11-20',
        bookingDate: '2025-10-15',
        eventVenue: 'Heritage Residency, Madurai',
        amount: 35000,
        advanceAmount: 10000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-10-15T09:45:00.000Z'
      },
      {
        id: 'BK-1005',
        customerName: 'Vignesh & Keerthana',
        customerEmail: 'vignesh.k@example.com',
        customerPhone: '+91 98405 55667',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-luxury',
        packageName: 'Luxury Package',
        basePackagePrice: '₹50,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-11-28',
        bookingDate: '2025-10-20',
        eventVenue: 'Grand Regency, Madurai',
        amount: 50000,
        advanceAmount: 15000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-10-20T16:20:00.000Z'
      },
      {
        id: 'BK-1006',
        customerName: 'Arun & Divya',
        customerEmail: 'arun.divya@example.com',
        customerPhone: '+91 98840 66778',
        serviceId: 'pre-wedding-shoot',
        serviceName: 'Pre-Wedding Shoot',
        packageId: 'pkg-budget',
        packageName: 'Budget Package',
        basePackagePrice: '₹35,000',
        includedServices: ['Traditional Photographer', 'HD Video', '15 × 10 Album with 30 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-12-05',
        bookingDate: '2025-11-01',
        eventVenue: 'Kodaikanal Lake & Pine Forest',
        amount: 35000,
        advanceAmount: 10000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-11-01T12:00:00.000Z'
      },
      {
        id: 'BK-1007',
        customerName: 'Ganesh & Priya',
        customerEmail: 'ganesh.priya@example.com',
        customerPhone: '+91 98414 77889',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-luxury',
        packageName: 'Luxury Package',
        basePackagePrice: '₹50,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-12-14',
        bookingDate: '2025-11-10',
        eventVenue: 'Lakshmi Sundaram Hall, Madurai',
        amount: 50000,
        advanceAmount: 20000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-11-10T15:30:00.000Z'
      },
      {
        id: 'BK-1008',
        customerName: 'Saravanan & Revathi',
        customerEmail: 'saravanan.r@example.com',
        customerPhone: '+91 94441 88990',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-semi-luxury',
        packageName: 'Semi-Luxury Package',
        basePackagePrice: '₹65,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', 'Candid Videography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2025-12-22',
        bookingDate: '2025-11-18',
        eventVenue: 'Sree Meenakshi Sundareswarar Temple Hall',
        amount: 65000,
        advanceAmount: 25000,
        status: 'Completed',
        paymentStatus: 'Fully Paid',
        createdAt: '2025-11-18T17:00:00.000Z'
      },
      {
        id: 'BK-1009',
        customerName: 'Ramesh Babu',
        customerEmail: 'ramesh.babu@example.com',
        customerPhone: '+91 98402 99001',
        serviceId: 'birthday-photography',
        serviceName: 'Birthday Photography',
        packageId: 'pkg-budget',
        packageName: 'Budget Package',
        basePackagePrice: '₹35,000',
        includedServices: ['Traditional Photographer', 'HD Video', '15 × 10 Album with 30 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2026-01-08',
        bookingDate: '2025-12-15',
        eventVenue: 'Courtyard by Marriott, Madurai',
        amount: 35000,
        advanceAmount: 10000,
        status: 'Confirmed',
        paymentStatus: 'Advance Paid',
        createdAt: '2025-12-15T11:20:00.000Z'
      },
      {
        id: 'BK-1010',
        customerName: 'Dinesh & Kavitha',
        customerEmail: 'dinesh.k@example.com',
        customerPhone: '+91 98403 10112',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-luxury',
        packageName: 'Luxury Package',
        basePackagePrice: '₹50,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2026-01-19',
        bookingDate: '2025-12-20',
        eventVenue: 'JC Residency, Madurai',
        amount: 50000,
        advanceAmount: 15000,
        status: 'Confirmed',
        paymentStatus: 'Advance Paid',
        createdAt: '2025-12-20T10:15:00.000Z'
      },
      {
        id: 'BK-1011',
        customerName: 'Manojkumar & Sangeetha',
        customerEmail: 'manoj.s@example.com',
        customerPhone: '+91 97910 20223',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-semi-luxury',
        packageName: 'Semi-Luxury Package',
        basePackagePrice: '₹65,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', 'Candid Videography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2026-01-26',
        bookingDate: '2026-01-02',
        eventVenue: 'Pandiyan Marriage Palace, Madurai',
        amount: 65000,
        advanceAmount: 20000,
        status: 'Confirmed',
        paymentStatus: 'Advance Paid',
        createdAt: '2026-01-02T13:40:00.000Z'
      },
      {
        id: 'BK-1012',
        customerName: 'Senthil Nathan',
        customerEmail: 'senthil.n@example.com',
        customerPhone: '+91 98404 30334',
        serviceId: 'engagement-photography',
        serviceName: 'Engagement Photography',
        packageId: 'pkg-budget',
        packageName: 'Budget Package',
        basePackagePrice: '₹35,000',
        includedServices: ['Traditional Photographer', 'HD Video', '15 × 10 Album with 30 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2026-02-04',
        bookingDate: '2026-01-10',
        eventVenue: 'Hotel Sangam, Madurai',
        amount: 35000,
        advanceAmount: 10000,
        status: 'Confirmed',
        paymentStatus: 'Advance Paid',
        createdAt: '2026-01-10T14:30:00.000Z'
      },
      {
        id: 'BK-1013',
        customerName: 'Vijay & Sneha',
        customerEmail: 'vijay.sneha@example.com',
        customerPhone: '+91 98841 40445',
        serviceId: 'pre-wedding-shoot',
        serviceName: 'Pre-Wedding Shoot',
        packageId: 'pkg-luxury',
        packageName: 'Luxury Package',
        basePackagePrice: '₹50,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2026-02-14',
        bookingDate: '2026-01-18',
        eventVenue: 'Dhanushkodi Beach & Ghost Town',
        amount: 50000,
        advanceAmount: 15000,
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: '2026-01-18T16:10:00.000Z'
      },
      {
        id: 'BK-1014',
        customerName: 'Subramanian & Gomathi',
        customerEmail: 'subbu.g@example.com',
        customerPhone: '+91 98415 50556',
        serviceId: 'wedding-photography',
        serviceName: 'Wedding Photography',
        packageId: 'pkg-luxury',
        packageName: 'Luxury Package',
        basePackagePrice: '₹50,000',
        includedServices: ['Traditional Photographer', 'HD Video', 'Candid Photography', '15 × 10 Album with 60 Pages', 'Pendrive', 'Photo Frame', 'Bag'],
        eventDate: '2026-02-22',
        bookingDate: '2026-01-25',
        eventVenue: 'Mappillai Vinayagar Mahal, Madurai',
        amount: 50000,
        advanceAmount: 15000,
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: '2026-01-25T11:45:00.000Z'
      }
    ];

    dbStore.bookings = demoBookings;

    // Also sync matching customers
    demoBookings.forEach((b) => {
      dbStore.addCustomer({
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone,
        city: 'Madurai',
        notes: `Customer linked with booking ${b.id} (${b.serviceName})`
      });
    });

    return res.json({
      success: true,
      message: 'Successfully seeded realistic studio bookings across recent months for data analytics testing.',
      count: demoBookings.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed sample demo data',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// POST /api/analytics/clear
router.post('/clear', requireAdminAuth, (req: Request, res: Response) => {
  try {
    dbStore.clearAllBookings();
    return res.json({
      success: true,
      message: 'Cleared all studio bookings from database'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to clear bookings',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
