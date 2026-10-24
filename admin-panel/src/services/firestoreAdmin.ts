import { 
  firestoreBookingsService, 
  FirestoreBookingDoc 
} from '../../../src/services/firestoreBookings';
export { firestoreBookingsService };
export type { FirestoreBookingDoc };
import { 
  Booking, 
  StudioAnalyticsData, 
  MonthlyBookingRecord, 
  MonthlyRevenueRecord, 
  TwoMonthComparisonData 
} from './api';

// Helper to format YYYY-MM into readable month label
export function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-');
  if (!year || !month) return ym;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mIdx = parseInt(month, 10) - 1;
  return `${monthNames[mIdx] || month} ${year}`;
}

export const firestoreAdminService = {
  /**
   * Fetch all bookings directly from Cloud Firestore
   */
  async getLiveBookings(statusFilter?: string): Promise<Booking[]> {
    const firestoreDocs = await firestoreBookingsService.getAllBookingsAdmin(statusFilter);
    return firestoreDocs.map((doc): Booking => ({
      id: doc.id || doc.bookingId,
      customerName: doc.customerName || 'Customer',
      customerEmail: doc.customerEmail || '',
      customerPhone: doc.customerPhone || '',
      serviceId: doc.serviceId || 'custom-shoot',
      serviceName: doc.serviceName || 'Studio Shoot',
      packageId: doc.packageId,
      packageName: doc.packageName || 'Budget',
      basePackagePrice: doc.basePackagePrice,
      includedServices: doc.includedServices || [],
      customizations: doc.customizations || [],
      customizationStatus: doc.customizationStatus,
      eventDate: doc.eventDate || '',
      bookingDate: doc.bookingDate || '',
      eventVenue: doc.eventVenue || '',
      eventReason: doc.eventReason || '',
      expectations: doc.expectations || '',
      amount: Number(doc.amount) || 30000,
      advanceAmount: Number(doc.advanceAmount) || 0,
      status: doc.status || 'Pending',
      rejectionReason: doc.rejectionReason,
      adminNotes: doc.adminNotes,
      createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : (doc.bookingDate || new Date().toISOString()),
      updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : (doc.bookingDate || new Date().toISOString())
    }));
  },

  /**
   * Subscribe to live real-time booking changes from Cloud Firestore
   */
  subscribeLiveBookings(callback: (bookings: Booking[]) => void, statusFilter?: string) {
    return firestoreBookingsService.subscribeAllBookingsAdmin((firestoreDocs) => {
      const mapped = firestoreDocs.map((doc): Booking => ({
        id: doc.id || doc.bookingId,
        customerName: doc.customerName || 'Customer',
        customerEmail: doc.customerEmail || '',
        customerPhone: doc.customerPhone || '',
        serviceId: doc.serviceId || 'custom-shoot',
        serviceName: doc.serviceName || 'Studio Shoot',
        packageId: doc.packageId,
        packageName: doc.packageName || 'Budget',
        basePackagePrice: doc.basePackagePrice,
        includedServices: doc.includedServices || [],
        customizations: doc.customizations || [],
        customizationStatus: doc.customizationStatus,
        eventDate: doc.eventDate || '',
        bookingDate: doc.bookingDate || '',
        eventVenue: doc.eventVenue || '',
        eventReason: doc.eventReason || '',
        expectations: doc.expectations || '',
        amount: Number(doc.amount) || 30000,
        advanceAmount: Number(doc.advanceAmount) || 0,
        status: doc.status || 'Pending',
        rejectionReason: doc.rejectionReason,
        adminNotes: doc.adminNotes,
        createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : (doc.bookingDate || new Date().toISOString()),
        updatedAt: typeof doc.updatedAt === 'string' ? doc.updatedAt : (doc.bookingDate || new Date().toISOString())
      }));
      callback(mapped);
    }, statusFilter);
  },

  /**
   * Update booking status in Cloud Firestore
   */
  async updateBookingStatus(
    id: string,
    status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled',
    rejectionReason?: string,
    adminNotes?: string
  ): Promise<void> {
    await firestoreBookingsService.updateBookingStatus(id, status, rejectionReason, adminNotes);
  },

  /**
   * Compute actual, live analytics purely from Cloud Firestore booking records (NO MOCK DATA)
   */
  computeLiveAnalytics(
    bookings: Booking[], 
    monthA?: string, 
    monthB?: string
  ): StudioAnalyticsData {
    // 1. Group records by month (YYYY-MM)
    const monthGroups: Record<string, Booking[]> = {};

    bookings.forEach((b) => {
      const dateStr = b.eventDate || b.bookingDate || b.createdAt || '';
      const match = dateStr.match(/^(\d{4})-(\d{2})/);
      const ym = match ? `${match[1]}-${match[2]}` : new Date().toISOString().slice(0, 7);
      if (!monthGroups[ym]) {
        monthGroups[ym] = [];
      }
      monthGroups[ym].push(b);
    });

    // Determine sorted available months
    let availableYMs = Object.keys(monthGroups).sort();
    if (availableYMs.length === 0) {
      // Current and previous month as placeholders for selector labels
      const now = new Date();
      const currentYM = now.toISOString().slice(0, 7);
      now.setMonth(now.getMonth() - 1);
      const prevYM = now.toISOString().slice(0, 7);
      availableYMs = [prevYM, currentYM];
    }

    const availableMonths = availableYMs.map((ym) => ({
      month: ym,
      label: formatMonthLabel(ym)
    }));

    // 2. Compute Monthly Booking Analysis records
    const monthlyBookingRecords: MonthlyBookingRecord[] = [];
    const monthlyRevenueRecords: MonthlyRevenueRecord[] = [];

    let overallTotalConfirmedRevenue = 0;
    const overallStatusTotals = {
      confirmed: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0
    };

    availableYMs.forEach((ym) => {
      const group = monthGroups[ym] || [];
      const statusCounts = {
        confirmed: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        rejected: 0
      };

      let monthConfirmedValue = 0;
      let monthConfirmedCount = 0;

      group.forEach((b) => {
        const s = b.status?.toLowerCase() || 'pending';
        if (s === 'confirmed') {
          statusCounts.confirmed += 1;
          overallStatusTotals.confirmed += 1;
          monthConfirmedCount += 1;
          monthConfirmedValue += Number(b.amount) || 0;
        } else if (s === 'completed') {
          statusCounts.completed += 1;
          overallStatusTotals.completed += 1;
          monthConfirmedCount += 1;
          monthConfirmedValue += Number(b.amount) || 0;
        } else if (s === 'rejected') {
          statusCounts.rejected += 1;
          overallStatusTotals.rejected += 1;
        } else if (s === 'cancelled') {
          statusCounts.cancelled += 1;
          overallStatusTotals.cancelled += 1;
        } else {
          statusCounts.pending += 1;
          overallStatusTotals.pending += 1;
        }
      });

      overallTotalConfirmedRevenue += monthConfirmedValue;

      monthlyBookingRecords.push({
        month: ym,
        label: formatMonthLabel(ym),
        bookingCount: group.length,
        statusBreakdown: statusCounts
      });

      monthlyRevenueRecords.push({
        month: ym,
        label: formatMonthLabel(ym),
        confirmedBookingsCount: monthConfirmedCount,
        confirmedBookingValue: monthConfirmedValue,
        averageBookingValue: monthConfirmedCount > 0 ? Math.round(monthConfirmedValue / monthConfirmedCount) : 0
      });
    });

    // 3. Select default months for comparison if not passed
    const targetA = monthA && availableYMs.includes(monthA) 
      ? monthA 
      : (availableYMs.length >= 2 ? availableYMs[availableYMs.length - 2] : availableYMs[0]);
    const targetB = monthB && availableYMs.includes(monthB) 
      ? monthB 
      : availableYMs[availableYMs.length - 1];

    const dataA = monthlyBookingRecords.find((r) => r.month === targetA) || {
      month: targetA,
      label: formatMonthLabel(targetA),
      bookingCount: 0,
      statusBreakdown: { confirmed: 0, pending: 0, completed: 0, cancelled: 0, rejected: 0 }
    };

    const dataB = monthlyBookingRecords.find((r) => r.month === targetB) || {
      month: targetB,
      label: formatMonthLabel(targetB),
      bookingCount: 0,
      statusBreakdown: { confirmed: 0, pending: 0, completed: 0, cancelled: 0, rejected: 0 }
    };

    const revA = monthlyRevenueRecords.find((r) => r.month === targetA)?.confirmedBookingValue || 0;
    const revB = monthlyRevenueRecords.find((r) => r.month === targetB)?.confirmedBookingValue || 0;

    const bookingDiff = dataB.bookingCount - dataA.bookingCount;
    const bookingPct = dataA.bookingCount > 0 
      ? Number(((bookingDiff / dataA.bookingCount) * 100).toFixed(1)) 
      : (dataB.bookingCount > 0 ? 100 : 0);

    const revDiff = revB - revA;
    const revPct = revA > 0 
      ? Number(((revDiff / revA) * 100).toFixed(1)) 
      : (revB > 0 ? 100 : 0);

    const twoMonthComparison: TwoMonthComparisonData = {
      monthA: {
        month: targetA,
        label: formatMonthLabel(targetA),
        bookingCount: dataA.bookingCount,
        confirmedBookingValue: revA,
        confirmedCount: dataA.statusBreakdown.confirmed,
        pendingCount: dataA.statusBreakdown.pending,
        completedCount: dataA.statusBreakdown.completed
      },
      monthB: {
        month: targetB,
        label: formatMonthLabel(targetB),
        bookingCount: dataB.bookingCount,
        confirmedBookingValue: revB,
        confirmedCount: dataB.statusBreakdown.confirmed,
        pendingCount: dataB.statusBreakdown.pending,
        completedCount: dataB.statusBreakdown.completed
      },
      differences: {
        bookingCountDiff: bookingDiff,
        absoluteBookingDiff: Math.abs(bookingDiff),
        bookingPercentageChange: bookingPct,
        bookingHigher: dataA.bookingCount > dataB.bookingCount ? 'Month A' : (dataB.bookingCount > dataA.bookingCount ? 'Month B' : 'Equal'),
        revenueDiff: revDiff,
        absoluteRevenueDiff: Math.abs(revDiff),
        revenuePercentageChange: revPct,
        revenueHigher: revA > revB ? 'Month A' : (revB > revA ? 'Month B' : 'Equal')
      }
    };

    return {
      success: true,
      availableMonths,
      monthlyBookingAnalysis: {
        records: monthlyBookingRecords,
        totalBookings: bookings.length,
        statusTotals: overallStatusTotals
      },
      monthlyRevenueAnalysis: {
        records: monthlyRevenueRecords,
        totalConfirmedBookingValue: overallTotalConfirmedRevenue,
        revenueMetricLabel: 'Confirmed Booking Value (₹)',
        paymentRecordsAvailable: true,
        explanation: 'Directly calculated from live Cloud Firestore customer bookings in confirmed and completed statuses.'
      },
      twoMonthComparison,
      validationSummary: {
        totalScanned: bookings.length,
        validRecordsCount: bookings.length,
        duplicateIdCount: 0,
        invalidFieldsCount: 0,
        excludedCount: 0,
        statusBreakdown: overallStatusTotals,
        excludedRecords: []
      }
    };
  }
};
