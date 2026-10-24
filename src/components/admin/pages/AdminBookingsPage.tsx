import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Search, 
  Plus, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  DollarSign, 
  Edit, 
  Trash2, 
  X, 
  Filter, 
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminBooking, BookingStatus } from '../../../types/admin';

export const AdminBookingsPage: React.FC = () => {
  const { 
    bookings, 
    addBooking, 
    updateBooking, 
    updateBookingStatus, 
    deleteBooking, 
    selectedBookingId, 
    setSelectedBookingId,
    services,
    packages,
    customers
  } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Booking Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedService, setSelectedService] = useState('Wedding Photography');
  const [selectedPkg, setSelectedPkg] = useState('Royal Heritage Package');
  const [eventDate, setEventDate] = useState('');
  const [sessionTime, setSessionTime] = useState('Full Day');
  const [venue, setVenue] = useState('Madurai');
  const [amount, setAmount] = useState('₹45,000');
  const [notes, setNotes] = useState('');

  // Edit Booking Modal
  const [editingBooking, setEditingBooking] = useState<AdminBooking | null>(null);

  // Filtered list
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedBooking = bookings.find(b => b.id === selectedBookingId) || null;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Completed':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-300';
      default:
        return 'bg-neutral-50 text-neutral-800 border-neutral-300';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !eventDate) return;

    const rawVal = parseInt(amount.replace(/[^0-9]/g, '')) || 25000;

    addBooking({
      customerId: `CUST-AUTO`,
      customerName,
      customerEmail,
      customerPhone,
      service: selectedService,
      package: selectedPkg,
      eventDate,
      sessionTime,
      venue,
      status: 'Pending',
      amount: amount.startsWith('₹') ? amount : `₹${amount}`,
      rawAmount: rawVal,
      specialNotes: notes
    });

    setShowAddModal(false);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setNotes('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    const rawVal = parseInt(editingBooking.amount.replace(/[^0-9]/g, '')) || editingBooking.rawAmount;

    updateBooking(editingBooking.id, {
      ...editingBooking,
      rawAmount: rawVal
    });

    setEditingBooking(null);
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Are you sure you want to remove reservation #${code}?`)) {
      deleteBooking(id);
      if (selectedBookingId === id) setSelectedBookingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            RESERVATIONS & SCHEDULING
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Bookings Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Track, approve, manage status, and schedule shoots across all studio packages.
          </p>
        </div>

        <button
          id="btn-add-booking-open"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Reservation</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, client, service..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-neutral-900 text-[#f3e5ab] shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
              {st === 'Pending' && bookings.filter(b => b.status === 'Pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                  {bookings.filter(b => b.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Event Date</th>
                <th className="py-3.5 px-4">Venue</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <div className="space-y-3 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-amber-50 text-[#aa820a] flex items-center justify-center mx-auto">
                        <CalendarCheck className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-neutral-800 font-cinzel">No Bookings Recorded</p>
                      <p className="text-xs text-neutral-500">
                        {searchQuery || statusFilter !== 'All'
                          ? 'No bookings match your current filter criteria.'
                          : 'Your live bookings list is currently empty. Client reservations made on the website or added manually will appear here instantly.'}
                      </p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Add New Booking</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#aa820a]">
                      {b.bookingId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-neutral-900 block">{b.customerName}</span>
                        <span className="text-[10px] text-neutral-500">{b.customerPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-800 font-semibold truncate max-w-[130px]">
                      {b.service}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 truncate max-w-[150px]">
                      <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-semibold">
                        {b.package.replace(' Package', '')}
                      </span>
                      {b.customizations && b.customizations.length > 0 && (
                        <div className="mt-1">
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-800 text-[9px] font-bold">
                            +{b.customizations.length} Customizations (Contact Req.)
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 whitespace-nowrap">
                      {b.eventDate}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 truncate max-w-[120px]">
                      {b.venue}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {b.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Quick Approve / Reject triggers for Pending status */}
                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Approve & Confirm Booking"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                              title="Reject / Cancel"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedBookingId(b.id)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          title="View Full Booking Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#aa820a]" />
                        </button>

                        <button
                          onClick={() => setEditingBooking(b)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                          title="Edit Booking"
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-600" />
                        </button>

                        <button
                          onClick={() => handleDelete(b.id, b.bookingId)}
                          className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600 transition-colors"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Top */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-[#aa820a] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {selectedBooking.bookingId}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 font-cinzel mt-2">
                  {selectedBooking.service}
                </h3>
                <p className="text-xs text-neutral-500">
                  Booked on {selectedBooking.createdDate}
                </p>
              </div>

              <button
                onClick={() => setSelectedBookingId(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Information Block */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-cinzel">
                Customer Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-neutral-500">Client Name:</span>
                  <div className="font-bold text-neutral-900">{selectedBooking.customerName}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Phone:</span>
                  <div className="font-bold text-neutral-900">{selectedBooking.customerPhone}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Email:</span>
                  <div className="font-bold text-neutral-900">{selectedBooking.customerEmail}</div>
                </div>
                <div>
                  <span className="text-neutral-500">Venue:</span>
                  <div className="font-bold text-neutral-900">{selectedBooking.venue}</div>
                </div>
              </div>
            </div>

            {/* Event & Shoot Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 font-semibold uppercase text-[10px]">Event Date</span>
                <div className="text-sm font-bold text-neutral-900 mt-1">{selectedBooking.eventDate}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="text-neutral-500 font-semibold uppercase text-[10px]">Package</span>
                <div className="text-sm font-bold text-[#aa820a] mt-1">{selectedBooking.package}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900 text-white border border-neutral-800">
                <span className="text-[#f3e5ab] font-semibold uppercase text-[10px]">Package Value</span>
                <div className="text-sm font-bold text-[#f3e5ab] mt-1">{selectedBooking.amount}</div>
              </div>
            </div>

            {/* Selected Customizable Options Block */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider font-cinzel flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Selected Customizable Options
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold border border-amber-400">
                  {selectedBooking.customizationStatus || (selectedBooking.customizations && selectedBooking.customizations.length > 0 ? 'Contact Studio for Additional Pricing' : 'None Selected')}
                </span>
              </div>
              {selectedBooking.customizations && selectedBooking.customizations.length > 0 ? (
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBooking.customizations.map((c) => (
                      <span key={c} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold border border-amber-300 text-xs">
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs leading-relaxed">
                    <strong>Studio Action Required:</strong> The customer selected customizable add-ons ({selectedBooking.customizations.join(', ')}). NG Digital Studio must contact the client at <span className="font-bold underline">{selectedBooking.customerPhone}</span> or <span className="font-bold underline">{selectedBooking.customerEmail}</span> to discuss availability and agreed additional pricing before finalizing total billing.
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 italic">No customizable options requested. Standard base package deliverables apply.</p>
              )}
            </div>

            {/* Special Instructions & Requirements */}
            {selectedBooking.specialNotes && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
                <h5 className="font-bold text-amber-900 mb-1">Special Client Requirements / Notes:</h5>
                <p className="text-amber-800">{selectedBooking.specialNotes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {selectedBooking.status !== 'Confirmed' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'Confirmed');
                      setSelectedBookingId(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Confirm</span>
                  </button>
                )}

                {selectedBooking.status !== 'Completed' && selectedBooking.status === 'Confirmed' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'Completed');
                      setSelectedBookingId(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Completed</span>
                  </button>
                )}

                {selectedBooking.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'Cancelled');
                      setSelectedBookingId(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-red-300 hover:bg-red-50 text-red-700 text-xs font-bold flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject / Cancel</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedBookingId(null)}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW RESERVATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Create Direct Reservation
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="block text-neutral-700 font-semibold">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh V"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Photography Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Package</label>
                  <select
                    value={selectedPkg}
                    onChange={(e) => setSelectedPkg(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  >
                    {packages.map(p => (
                      <option key={p.id} value={p.name}>{p.name} ({p.price})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Session Timing</label>
                  <input
                    type="text"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    placeholder="e.g. 9:00 AM - 4:00 PM"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Venue / Location</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Meenakshi Mandapam, Madurai"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Total Quotation / Amount</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="₹45,000"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Special Requirements</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Drone coverage required, 4K video teaser, candid focus..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Book Reservation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT BOOKING MODAL */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="text-lg font-bold text-neutral-900 font-cinzel">
                Edit Booking ({editingBooking.bookingId})
              </h3>
              <button onClick={() => setEditingBooking(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingBooking.customerName}
                  onChange={(e) => setEditingBooking({ ...editingBooking, customerName: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Status</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as BookingStatus })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Event Date</label>
                  <input
                    type="text"
                    value={editingBooking.eventDate}
                    onChange={(e) => setEditingBooking({ ...editingBooking, eventDate: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    value={editingBooking.venue}
                    onChange={(e) => setEditingBooking({ ...editingBooking, venue: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Amount</label>
                  <input
                    type="text"
                    value={editingBooking.amount}
                    onChange={(e) => setEditingBooking({ ...editingBooking, amount: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">Special Notes</label>
                <textarea
                  rows={2}
                  value={editingBooking.specialNotes || ''}
                  onChange={(e) => setEditingBooking({ ...editingBooking, specialNotes: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider"
                >
                  Update Reservation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
