import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck2, 
  Check, 
  X, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Calendar,
  DollarSign,
  Trash2,
  Sparkles,
  RefreshCw,
  Radio
} from 'lucide-react';
import { api, Booking } from '../../services/api';
import { firestoreAdminService, firestoreBookingsService } from '../../services/firestoreAdmin';
import { 
  getConfirmationWhatsAppUrl, 
  getRejectionWhatsAppUrl, 
  openWhatsAppChat 
} from '../../services/whatsappNotification';

export const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Rejection Modal State
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async (status?: string, silent = false) => {
    try {
      if (!silent) setLoading(true);
      let data: Booking[];
      try {
        data = await firestoreAdminService.getLiveBookings(status);
      } catch (fErr) {
        console.warn("Direct Firestore fetch notice, using API:", fErr);
        data = await api.getBookings(status);
      }
      setBookings(data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(statusFilter);

    // Real-time Firestore subscription for instant booking updates
    const unsubscribe = firestoreAdminService.subscribeLiveBookings((liveDocs) => {
      if (statusFilter && statusFilter !== 'All') {
        setBookings(liveDocs.filter(b => b.status === statusFilter));
      } else {
        setBookings(liveDocs);
      }
    }, statusFilter);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [statusFilter]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookings(statusFilter);
    setIsRefreshing(false);
  };

  const handleDeduplicate = async () => {
    try {
      setActionLoading(true);
      await api.deduplicateBookings();
      fetchBookings(statusFilter);
    } catch (err: any) {
      console.error('Deduplication error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, customerName: string) => {
    if (!window.confirm(`Are you sure you want to delete booking ${id} for ${customerName}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      // Delete from Firestore
      try {
        await firestoreBookingsService.deleteBooking(id);
      } catch (fErr) {
        console.warn("Firestore delete notice:", fErr);
      }
      // Also delete from API
      await api.deleteBooking(id);
      fetchBookings(statusFilter);
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete ALL bookings from the database.\n\nAre you sure you want to proceed?')) {
      return;
    }

    try {
      setActionLoading(true);
      await api.clearAllBookings();
      fetchBookings(statusFilter);
    } catch (err: any) {
      console.error('Error clearing bookings:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirm = async (booking: Booking) => {
    if (!window.confirm(`Confirm booking for ${booking.customerName} (${booking.serviceName})?\nThis will automatically update the booking status to Confirmed in Cloud Firestore.`)) {
      return;
    }

    try {
      setActionLoading(true);
      // 1. Update directly in Cloud Firestore
      try {
        await firestoreAdminService.updateBookingStatus(booking.id, 'Confirmed', undefined, 'Lead photography crew & equipment allocated.');
      } catch (fErr) {
        console.warn("Firestore status update notice:", fErr);
      }

      // 2. Also notify backend service for email alert
      try {
        await api.confirmBooking(booking.id, 'Lead photography crew & equipment allocated.');
      } catch (apiErr) {
        console.warn("Backend confirm alert notice:", apiErr);
      }

      // 3. WhatsApp Click-to-Chat notification
      const waResult = getConfirmationWhatsAppUrl(booking);
      if (waResult.url) {
        openWhatsAppChat(waResult.url);
      } else {
        console.warn(`Customer phone validation: ${waResult.error}`);
      }

      fetchBookings(statusFilter);
      if (selectedBooking?.id === booking.id) {
        setSelectedBooking({ ...booking, status: 'Confirmed' });
      }
    } catch (err: any) {
      console.error('Error confirming booking:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingBooking || !rejectionReason.trim()) return;

    const bookingToReject = rejectingBooking;
    const currentReason = rejectionReason;
    const currentNotes = rejectionNotes;

    try {
      setActionLoading(true);
      // 1. Update directly in Cloud Firestore
      try {
        await firestoreAdminService.updateBookingStatus(bookingToReject.id, 'Rejected', currentReason, currentNotes);
      } catch (fErr) {
        console.warn("Firestore reject update notice:", fErr);
      }

      // 2. Also notify backend service
      try {
        await api.rejectBooking(bookingToReject.id, currentReason, currentNotes);
      } catch (apiErr) {
        console.warn("Backend reject alert notice:", apiErr);
      }

      // 3. WhatsApp Click-to-Chat notification
      const waResult = getRejectionWhatsAppUrl(bookingToReject, currentReason, currentNotes);
      if (waResult.url) {
        openWhatsAppChat(waResult.url);
      } else {
        console.warn(`Customer phone validation: ${waResult.error}`);
      }

      setRejectingBooking(null);
      setRejectionReason('');
      setRejectionNotes('');
      fetchBookings(statusFilter);
      if (selectedBooking?.id === bookingToReject.id) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      console.error('Error rejecting booking:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      fetchBookings(statusFilter);
    } catch (err: any) {
      console.error('Error updating status:', err);
    }
  };

  const filterTabs = ['All', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'];

  return (
    <div className="p-4 lg:p-8 space-y-6">

      {/* Header and Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#121217] p-4 sm:p-5 rounded-2xl border border-[#20202a]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">Booking Management</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE SYNC</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400">
            Real-time event bookings, status lifecycle, and automated email dispatches.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="admin-refresh-bookings"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-[#1a1a24] hover:bg-[#252533] border border-neutral-700 text-neutral-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Refresh bookings from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            id="admin-deduplicate-bookings"
            onClick={handleDeduplicate}
            disabled={actionLoading || bookings.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#20202d] hover:bg-[#d4af37] hover:text-black border border-neutral-700 hover:border-[#d4af37] text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            title="Remove any duplicate bookings with same event date and service"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Remove Duplicates</span>
          </button>

          {bookings.length > 0 && (
            <button
              id="admin-clear-all-bookings"
              onClick={handleClearAll}
              disabled={actionLoading}
              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Delete all bookings to start clean"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217] p-4 rounded-2xl border border-[#20202a]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${statusFilter === tab
                  ? 'bg-[#d4af37] text-black font-extrabold shadow-sm'
                  : 'bg-[#181822] text-neutral-400 hover:text-white hover:bg-[#20202e]'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-2 shrink-0">
          <CalendarCheck2 className="w-4 h-4 text-[#d4af37]" />
          <span>Showing <strong className="text-white">{bookings.length}</strong> bookings</span>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#121217] border border-[#20202a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181822] text-neutral-400 font-semibold border-b border-[#242433]">
              <tr>
                <th className="p-4 uppercase tracking-wider">Booking ID / Date</th>
                <th className="p-4 uppercase tracking-wider">Customer Contact</th>
                <th className="p-4 uppercase tracking-wider">Service & Package</th>
                <th className="p-4 uppercase tracking-wider">Event Schedule</th>
                <th className="p-4 uppercase tracking-wider">Total Amount</th>
                <th className="p-4 uppercase tracking-wider">Status</th>
                <th className="p-4 uppercase tracking-wider text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2b]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <div className="w-7 h-7 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs">Fetching live booking stream...</p>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a26] border border-neutral-800 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Live Bookings Active</p>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      All duplicate records have been cleaned up. As soon as a client submits a booking on the customer website, it will show up here immediately.
                    </p>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#161622] transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-white text-xs">{b.id}</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Booked: {b.bookingDate}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">{b.customerName}</p>
                      <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        <span>{b.customerEmail}</span>
                      </p>
                      {b.customerPhone && (
                        <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#d4af37]" />
                          <span>{b.customerPhone}</span>
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-white">{b.serviceName}</p>
                      <p className="text-[11px] text-[#d4af37] font-semibold">{b.packageName}</p>
                      {b.customizations && b.customizations.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#1e1909] text-[#f3e5ab] border border-[#d4af37]/40">
                            +{b.customizations.length} Customizations: {b.customizations.join(', ')}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Contact Required
                          </span>
                        </div>
                      )}
                      {b.expectations && (
                        <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5 max-w-xs" title={b.expectations}>
                          &quot;{b.expectations}&quot;
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>{b.eventDate}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{b.eventVenue || 'Madurai'}</span>
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-white text-xs">₹{b.amount.toLocaleString('en-IN')}</p>
                      {b.advanceAmount > 0 && (
                        <p className="text-[10px] text-emerald-400 font-medium">Adv: ₹{b.advanceAmount.toLocaleString('en-IN')}</p>
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full outline-none border cursor-pointer ${
                          b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                          b.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                          b.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                          b.status === 'Completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                          'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}
                      >
                        <option value="Pending" className="bg-[#121217] text-amber-400">Pending</option>
                        <option value="Confirmed" className="bg-[#121217] text-emerald-400">Confirmed</option>
                        <option value="Rejected" className="bg-[#121217] text-red-400">Rejected</option>
                        <option value="Completed" className="bg-[#121217] text-blue-400">Completed</option>
                        <option value="Cancelled" className="bg-[#121217] text-neutral-400">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="p-1.5 rounded-lg bg-[#222230] hover:bg-[#d4af37] hover:text-black text-neutral-300 transition-colors"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(b.id, b.customerName)}
                          className="p-1.5 rounded-lg bg-[#222230] hover:bg-red-600 text-neutral-400 hover:text-white transition-colors"
                          title="Delete Booking Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleConfirm(b)}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                              title="Confirm & Dispatch Email"
                            >
                              <Check className="w-3 h-3" />
                              <span>Confirm</span>
                            </button>

                            <button
                              onClick={() => { setRejectingBooking(b); setRejectionReason(''); }}
                              disabled={actionLoading}
                              className="px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-800/80 hover:bg-red-900 text-red-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                              title="Reject & Dispatch Notice"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#282838] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#242433]">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-mono font-bold text-sm">
                BK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedBooking.id}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedBooking.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    selectedBooking.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Booked on {selectedBooking.bookingDate}</p>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Client Name</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{selectedBooking.customerName}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Client Email</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{selectedBooking.customerEmail}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Contact Phone</span>
                  <p className="text-xs font-semibold text-[#d4af37] mt-0.5">{selectedBooking.customerPhone}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Event Date</span>
                  <p className="text-xs font-semibold text-white mt-0.5">{selectedBooking.eventDate}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Service & Package Chosen</span>
                <p className="text-sm font-bold text-white mt-1">{selectedBooking.serviceName}</p>
                <p className="text-xs text-[#d4af37] font-semibold">{selectedBooking.packageName} • Base Price: ₹{selectedBooking.amount.toLocaleString('en-IN')}</p>
              </div>

              {/* Selected Customizable Options Block */}
              <div className="p-4 rounded-xl bg-[#181824] border border-[#d4af37]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#d4af37] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Selected Customizable Options
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                    {selectedBooking.customizationStatus || (selectedBooking.customizations && selectedBooking.customizations.length > 0 ? 'Contact Studio for Additional Pricing' : 'None Selected')}
                  </span>
                </div>
                {selectedBooking.customizations && selectedBooking.customizations.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedBooking.customizations.map((c) => (
                        <span key={c} className="px-2.5 py-1 rounded-lg bg-[#221e10] border border-[#d4af37]/60 text-[#f3e5ab] text-xs font-semibold">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-700/60 text-[11px] text-amber-200 leading-relaxed">
                      <strong>Studio Action Required:</strong> Customer requested customizable options. Please contact client at <span className="text-white font-bold">{selectedBooking.customerPhone}</span> or <span className="text-white font-bold">{selectedBooking.customerEmail}</span> to discuss availability and finalize additional charges.
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No customizable options requested. Standard base package deliverables apply.</p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Event Venue</span>
                <p className="text-xs text-white mt-1">{selectedBooking.eventVenue || 'Madurai'}</p>
              </div>

              {selectedBooking.eventReason && (
                <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Occasion / Reason</span>
                  <p className="text-xs text-neutral-200 mt-1">{selectedBooking.eventReason}</p>
                </div>
              )}

              {selectedBooking.expectations && (
                <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Client Expectations</span>
                  <p className="text-xs text-neutral-200 mt-1">{selectedBooking.expectations}</p>
                </div>
              )}

              {selectedBooking.adminNotes && (
                <div className="p-3.5 rounded-xl bg-[#1b1b22] border border-[#d4af37]/30">
                  <span className="text-[10px] text-[#d4af37] uppercase tracking-wider font-semibold">Admin Dispatch Notes</span>
                  <p className="text-xs text-neutral-200 mt-1">{selectedBooking.adminNotes}</p>
                </div>
              )}

              {selectedBooking.rejectionReason && (
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/50">
                  <span className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">Rejection Reason Dispatched</span>
                  <p className="text-xs text-red-200 mt-1">{selectedBooking.rejectionReason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#242433] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedBooking.id, selectedBooking.customerName)}
                  className="px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                {selectedBooking.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleConfirm(selectedBooking)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => { setRejectingBooking(selectedBooking); setRejectionReason(''); }}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-900 text-red-300 text-xs font-bold transition-all"
                    >
                      Reject Booking
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Confirmation Dialog Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#14141c] border border-red-900/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reject Booking & Dispatch Email</h3>
                <p className="text-xs text-neutral-400">Ref: {rejectingBooking.id} • {rejectingBooking.customerName}</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              Please enter the specific cancellation reason. This explanation will be automatically composed into a courteous notification email sent to <strong className="text-white">{rejectingBooking.customerEmail}</strong> and pre-filled in a WhatsApp message to <strong className="text-[#d4af37]">{rejectingBooking.customerPhone}</strong>.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., The lead photography team is fully booked for this date slot. We would love to host you on an alternate date."
                  className="w-full bg-[#1b1b26] border border-[#2e2e42] focus:border-red-500 text-white text-xs rounded-xl p-3 outline-none transition-all placeholder:text-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Internal Studio Notes (Optional)
                </label>
                <input
                  type="text"
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Internal notes for studio records"
                  className="w-full bg-[#1b1b26] border border-[#2e2e42] focus:border-red-500 text-white text-xs rounded-xl p-2.5 outline-none transition-all placeholder:text-neutral-500"
                />
              </div>

              <div className="pt-3 border-t border-[#242433] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !rejectionReason.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {actionLoading ? 'Dispatching Notice...' : 'Confirm Rejection & Open WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
