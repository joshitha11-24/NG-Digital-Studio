import {
  db,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from '../firebase/config';
import { BookingData } from '../types';

export interface FirestoreBookingDoc {
  id: string; // Document ID (usually matches bookingId)
  bookingId: string;
  userId: string;
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
  eventVenue: string;
  eventReason: string;
  expectations: string;
  amount: number;
  advanceAmount: number;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled';
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: any;
  updatedAt: any;
}

export const firestoreBookingsService = {
  /**
   * Save a customer booking to Cloud Firestore
   */
  async createBooking(booking: Omit<FirestoreBookingDoc, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreBookingDoc> {
    const bookingId = booking.bookingId || `NG-${Date.now().toString().slice(-6)}`;
    const docRef = doc(db, 'bookings', bookingId);

    const dataToSave: Record<string, any> = {
      ...booking,
      id: bookingId,
      bookingId,
      status: booking.status || 'Pending',
      amount: Number(booking.amount) || 30000,
      advanceAmount: Number(booking.advanceAmount) || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(docRef, dataToSave);

    return {
      ...dataToSave,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as FirestoreBookingDoc;
  },

  /**
   * Fetch only bookings belonging to the specific customer (Requirement 3)
   */
  async getCustomerBookings(userId: string, email?: string): Promise<FirestoreBookingDoc[]> {
    if (!userId) return [];

    try {
      // Query by authenticated userId matching Firestore ownership rules
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const list: FirestoreBookingDoc[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirestoreBookingDoc);
      });

      // Sort client-side by date descending
      return list.sort((a, b) => {
        const dateA = a.bookingDate || a.eventDate || '';
        const dateB = b.bookingDate || b.eventDate || '';
        return dateB.localeCompare(dateA);
      });
    } catch (err) {
      console.error("Firestore getCustomerBookings error:", err);
      throw err;
    }
  },

  /**
   * Real-time listener for customer's personal bookings
   */
  subscribeCustomerBookings(userId: string, callback: (bookings: FirestoreBookingDoc[]) => void) {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const list: FirestoreBookingDoc[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirestoreBookingDoc);
      });
      list.sort((a, b) => {
        const dateA = a.bookingDate || a.eventDate || '';
        const dateB = b.bookingDate || b.eventDate || '';
        return dateB.localeCompare(dateA);
      });
      callback(list);
    }, (error) => {
      console.warn("Firestore customer bookings subscribe error:", error);
    });
  },

  /**
   * Fetch all bookings for the Admin interface
   */
  async getAllBookingsAdmin(statusFilter?: string): Promise<FirestoreBookingDoc[]> {
    try {
      const colRef = collection(db, 'bookings');
      let q = query(colRef);

      if (statusFilter && statusFilter !== 'All') {
        q = query(colRef, where('status', '==', statusFilter));
      }

      const snapshot = await getDocs(q);
      const list: FirestoreBookingDoc[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirestoreBookingDoc);
      });

      // Sort by creation or event date descending
      return list.sort((a, b) => {
        const dateA = a.bookingDate || a.eventDate || '';
        const dateB = b.bookingDate || b.eventDate || '';
        return dateB.localeCompare(dateA);
      });
    } catch (err) {
      console.error("Firestore getAllBookingsAdmin error:", err);
      throw err;
    }
  },

  /**
   * Real-time listener for all bookings in Admin Panel
   */
  subscribeAllBookingsAdmin(callback: (bookings: FirestoreBookingDoc[]) => void, statusFilter?: string) {
    const colRef = collection(db, 'bookings');
    let q = query(colRef);

    if (statusFilter && statusFilter !== 'All') {
      q = query(colRef, where('status', '==', statusFilter));
    }

    return onSnapshot(q, (snapshot) => {
      const list: FirestoreBookingDoc[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirestoreBookingDoc);
      });
      list.sort((a, b) => {
        const dateA = a.bookingDate || a.eventDate || '';
        const dateB = b.bookingDate || b.eventDate || '';
        return dateB.localeCompare(dateA);
      });
      callback(list);
    }, (error) => {
      console.warn("Firestore admin bookings subscription notice:", error);
    });
  },

  /**
   * Update booking status in Firestore (Admin only)
   */
  async updateBookingStatus(
    bookingId: string,
    status: 'Pending' | 'Confirmed' | 'Rejected' | 'Completed' | 'Cancelled',
    rejectionReason?: string,
    adminNotes?: string
  ): Promise<void> {
    const docRef = doc(db, 'bookings', bookingId);
    const updatePayload: Record<string, any> = {
      status,
      updatedAt: serverTimestamp()
    };

    if (rejectionReason !== undefined) {
      updatePayload.rejectionReason = rejectionReason;
    }
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }

    await updateDoc(docRef, updatePayload);
  },

  /**
   * Delete a booking from Firestore
   */
  async deleteBooking(bookingId: string): Promise<void> {
    const docRef = doc(db, 'bookings', bookingId);
    await deleteDoc(docRef);
  }
};
