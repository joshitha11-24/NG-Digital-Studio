import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Printer, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  PlusCircle,
  Lock,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { BookingData, PageType, UserAccount } from '../../types';
import { STUDIO_INFO } from '../../data/studioData';
import { firestoreBookingsService, FirestoreBookingDoc } from '../../services/firestoreBookings';
import { auth } from '../../firebase/config';

interface MyBookingsPageProps {
  currentUser: UserAccount | null;
  onNavigate: (page: PageType, serviceId?: string) => void;
  onOpenAuth: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth
}) => {
  const [bookings, setBookings] = useState<FirestoreBookingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const effectiveUserId = currentUser?.uid || auth.currentUser?.uid || '';
  const effectiveEmail = currentUser?.email || auth.currentUser?.email || '';

  const loadCustomerBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      if (effectiveUserId || effectiveEmail) {
        const list = await firestoreBookingsService.getCustomerBookings(effectiveUserId, effectiveEmail);
        setBookings(list);
      } else {
        // Fallback to local storage if user not yet signed in
        const saved = localStorage.getItem('ng_studio_bookings');
        if (saved) {
          try {
            setBookings(JSON.parse(saved));
          } catch {
            setBookings([]);
          }
        } else {
          setBookings([]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch customer bookings from Firestore:", err);
      const saved = localStorage.getItem('ng_studio_bookings');
      if (saved) {
        try {
          setBookings(JSON.parse(saved));
        } catch {
          setBookings([]);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCustomerBookings();

    // Set up real-time listener if user is authenticated
    if (effectiveUserId) {
      const unsubscribe = firestoreBookingsService.subscribeCustomerBookings(effectiveUserId, (realtimeList) => {
        if (realtimeList && realtimeList.length > 0) {
          setBookings(realtimeList);
        }
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, [effectiveUserId, effectiveEmail]);

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>REJECTED</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>COMPLETED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>PENDING STUDIO REVIEW</span>
          </span>
        );
    }
  };

  return (
    <div id="my-bookings-page" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.2em] uppercase font-sans-clean">
            CLIENT RESERVATIONS & PORTAL
          </span>
          <h1 className="font-cinzel text-3xl font-extrabold text-white mt-1">
            My Studio Bookings
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-sans-clean">
            Securely synchronized with Cloud Firestore for real-time status and confirmation updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadCustomerBookings(true)}
            disabled={refreshing || loading}
            className="p-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Refresh bookings from Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('booking')}
            className="px-6 py-2.5 rounded-xl btn-gold text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Guest Warning Banner if not authenticated */}
      {!currentUser && (
        <div className="p-4 rounded-2xl bg-[#13131a] border border-[#d4af37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 text-[#d4af37] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm font-bold text-white">Sign In with Firebase to Access Verified Bookings</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Authentication keeps your celebration records, custom packages, and receipt slips secure and accessible from any device.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-5 py-2 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 bg-[#0e0e13] rounded-3xl border border-neutral-800 space-y-4">
          <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-mono">Fetching verified bookings from Cloud Firestore...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-[#0e0e13] rounded-3xl border border-neutral-800 space-y-4">
          <Calendar className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="font-cinzel text-xl font-bold text-white">
            No Active Bookings Found
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            You haven't reserved any photography sessions yet. Browse our specialized services or wedding packages to book your milestone.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('services')}
              className="px-6 py-3 rounded-xl btn-gold text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((b) => (
            <div
              key={b.bookingId || b.id}
              className="bg-[#0f0f14] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-400">Booking Reference</span>
                  <div className="text-xl font-cinzel font-bold text-[#d4af37]">{b.bookingId}</div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(b.status)}
                </div>
              </div>

              {/* Rejection Notice if rejected */}
              {b.status === 'Rejected' && (
                <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/40 text-red-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Reservation Unavailable for Selected Date</span>
                  </div>
                  <p className="text-neutral-300">
                    {b.rejectionReason || 'The studio crew is fully booked for this date. Please contact our support team on WhatsApp to reschedule.'}
                  </p>
                </div>
              )}

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-300">
                <div className="space-y-3">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Service & Package</span>
                    <strong className="text-white text-sm block mt-0.5 font-cinzel">
                      {b.serviceName || 'Studio Photography'} — {b.packageName || 'Budget'}
                    </strong>
                    <span className="text-neutral-400 block mt-0.5">
                      {b.basePackagePrice || (b.amount ? `₹${Number(b.amount).toLocaleString('en-IN')}` : '')}
                    </span>
                  </div>

                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Event Date & Reason</span>
                    <div className="flex items-center gap-2 mt-0.5 text-white font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{b.eventDate} ({b.eventReason})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Celebration Venue</span>
                    <div className="flex items-center gap-2 mt-0.5 text-white font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{b.eventVenue}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Customer Contact</span>
                    <strong className="text-white block mt-0.5">{b.customerName}</strong>
                    <div className="text-neutral-400 space-y-0.5 mt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#d4af37]" />
                        <span>{b.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#d4af37]" />
                        <span>{b.customerEmail}</span>
                      </div>
                    </div>
                  </div>

                  {b.customizations && b.customizations.length > 0 && (
                    <div>
                      <span className="text-neutral-500 block text-[10px] uppercase">Requested Customizations</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {b.customizations.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-[#181822] border border-neutral-700 text-[11px] text-[#f3e5ab]">
                            {c}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-1 italic">
                        {b.customizationStatus || 'Contact Studio for Additional Pricing'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`https://wa.me/${STUDIO_INFO.whatsapp}?text=Hello%20NG%20Digital%20Studio,%20inquiry%20regarding%20my%20booking%20reference%20${b.bookingId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center gap-2 hover:bg-[#20bd5a] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Studio Crew</span>
                </a>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
