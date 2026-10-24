import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  X, 
  Eye, 
  Clock, 
  Trash2, 
  UserPlus, 
  Sparkles, 
  RefreshCw, 
  Radio, 
  AlertTriangle,
  Check
} from 'lucide-react';
import { api, Customer } from '../../services/api';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add Customer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Madurai');
  const [newAddress, setNewAddress] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const fetchCustomers = async (query?: string, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await api.getCustomers(query);
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(searchQuery);
  }, [searchQuery]);

  // Live Auto-Refresh Polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCustomers(searchQuery, true);
    }, 5000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchCustomers(searchQuery);
    setIsRefreshing(false);
  };

  const handleDeduplicate = async () => {
    try {
      setActionLoading(true);
      await api.deduplicateCustomers();
      fetchCustomers(searchQuery);
    } catch (err: any) {
      console.error('Deduplication error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete customer record for "${name}"?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await api.deleteCustomer(id);
      fetchCustomers(searchQuery);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('⚠️ WARNING: This will remove ALL customer records from the database.\n\nAre you sure you want to proceed?')) {
      return;
    }

    try {
      setActionLoading(true);
      await api.clearAllCustomers();
      fetchCustomers(searchQuery);
    } catch (err: any) {
      console.error('Error clearing customers:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      console.warn('Please provide name and email address.');
      return;
    }

    try {
      setActionLoading(true);
      await api.createCustomer({
        name: newName.trim(),
        email: newEmail.trim(),
        phone: newPhone.trim(),
        city: newCity.trim(),
        address: newAddress.trim(),
        notes: newNotes.trim()
      });
      setShowAddModal(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewCity('Madurai');
      setNewAddress('');
      setNewNotes('');
      fetchCustomers(searchQuery);
    } catch (err: any) {
      console.error('Creation error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDetails = async (cust: Customer) => {
    try {
      setLoadingDetails(true);
      setSelectedCustomer(cust);
      const fullDetails = await api.getCustomer(cust.id);
      setSelectedCustomer(fullDetails);
    } catch (e) {
      console.error('Failed to load customer details:', e);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header and Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#121217] p-4 sm:p-5 rounded-2xl border border-[#20202a]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-white tracking-tight">Customer Management</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE SYNC</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400">
            Real-time client registry for inquiries, logins, and bookings across Tamil Nadu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="admin-refresh-customers"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-[#1a1a24] hover:bg-[#252533] border border-neutral-700 text-neutral-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Refresh records now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#d4af37]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            id="admin-deduplicate-customers"
            onClick={handleDeduplicate}
            disabled={actionLoading || customers.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#20202d] hover:bg-[#d4af37] hover:text-black border border-neutral-700 hover:border-[#d4af37] text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
            title="Scan and eliminate duplicate customer records"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] group-hover:text-black" />
            <span>Remove Duplicates</span>
          </button>

          <button
            id="admin-add-customer-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-lg shadow-[#d4af37]/10"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Client</span>
          </button>

          {customers.length > 0 && (
            <button
              id="admin-clear-all-customers"
              onClick={handleClearAll}
              disabled={actionLoading}
              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Delete all records to start fresh"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217] p-4 rounded-2xl border border-[#20202a]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="admin-customers-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full bg-[#181822] border border-[#2b2b3b] focus:border-[#d4af37] text-white text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-neutral-500"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Total Unique Clients: <strong className="text-white">{customers.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#121217] border border-[#20202a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181822] text-neutral-400 font-semibold border-b border-[#242433]">
              <tr>
                <th className="p-4 uppercase tracking-wider">Client Name</th>
                <th className="p-4 uppercase tracking-wider">Contact Details</th>
                <th className="p-4 uppercase tracking-wider">Location</th>
                <th className="p-4 uppercase tracking-wider">Registered Date</th>
                <th className="p-4 uppercase tracking-wider">Bookings</th>
                <th className="p-4 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e2b]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <div className="w-7 h-7 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs">Fetching live customer directory...</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a26] border border-neutral-800 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                      <Radio className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Live Customer Stream Active</p>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                      Duplicate mock records have been removed. Any customer who registers, logs in, or submits a booking on the website will instantly appear here.
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#222230] hover:bg-[#d4af37] hover:text-black text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Manually Register First Client</span>
                    </button>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#161622] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#20202d] border border-neutral-700 flex items-center justify-center text-white font-bold text-xs shrink-0 group-hover:border-[#d4af37] transition-colors">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{c.name}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">{c.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Mail className="w-3 h-3 text-neutral-500" />
                          <span>{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-neutral-400">
                            <Phone className="w-3 h-3 text-[#d4af37]" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{c.city || 'Madurai'}</span>
                      </div>
                    </td>

                    <td className="p-4 text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{c.createdAt}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[11px] font-bold">
                        {c.totalBookings || 0} Bookings
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetails(c)}
                          className="px-3 py-1.5 rounded-lg bg-[#222230] hover:bg-[#d4af37] hover:text-black text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                          title="View customer bookings and history"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg bg-[#222230] hover:bg-red-600 text-neutral-400 hover:text-white transition-all"
                          title="Delete customer record"
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#282838] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Register New Client</h3>
                <p className="text-xs text-neutral-400">Add a walk-in or offline photography client profile</p>
              </div>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh & Priya"
                  className="w-full bg-[#181822] border border-[#2c2c3b] focus:border-[#d4af37] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@gmail.com"
                    className="w-full bg-[#181822] border border-[#2c2c3b] focus:border-[#d4af37] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full bg-[#181822] border border-[#2c2c3b] focus:border-[#d4af37] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Madurai, Chennai, etc."
                    className="w-full bg-[#181822] border border-[#2c2c3b] focus:border-[#d4af37] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Area / Address</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. KK Nagar, Madurai"
                    className="w-full bg-[#181822] border border-[#2c2c3b] focus:border-[#d4af37] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Internal Studio Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Inquired for outdoor portrait session..."
                  className="w-full bg-[#181822] border border-[#2c2c3b] focus:border-[#d4af37] text-white text-xs rounded-xl px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#242433]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-black font-bold text-xs hover:brightness-110 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Client Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details & History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#13131a] border border-[#282838] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#242433]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#997d26] p-0.5">
                <div className="w-full h-full bg-[#121217] rounded-[14px] flex items-center justify-center text-[#d4af37] font-bold text-base">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                <p className="text-xs text-neutral-400">Client Profile & Booking Records</p>
              </div>
            </div>

            {/* Profile Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Email Address</span>
                <p className="text-xs font-semibold text-white mt-0.5">{selectedCustomer.email}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Contact Phone</span>
                <p className="text-xs font-semibold text-[#d4af37] mt-0.5">{selectedCustomer.phone || 'Not provided'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Location / Address</span>
                <p className="text-xs font-semibold text-white mt-0.5">{selectedCustomer.address || selectedCustomer.city || 'Madurai'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Registration Date</span>
                <p className="text-xs font-semibold text-white mt-0.5">{selectedCustomer.createdAt}</p>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="mb-6 p-3.5 rounded-xl bg-[#181824] border border-neutral-800">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Studio Internal Notes</span>
                <p className="text-xs text-neutral-300 mt-1">{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Booking History Section */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" />
                Booking History for {selectedCustomer.name}
              </h4>

              {loadingDetails ? (
                <div className="p-4 text-center text-xs text-neutral-500">Loading history...</div>
              ) : !selectedCustomer.bookings || selectedCustomer.bookings.length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-[#161622] text-xs text-neutral-400">
                  No previous bookings registered for this email.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedCustomer.bookings.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-xl bg-[#161622] border border-neutral-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">{b.serviceName}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">({b.id})</span>
                        </div>
                        <p className="text-[11px] text-[#d4af37]">{b.packageName} • ₹{b.amount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-neutral-400">Event Date: {b.eventDate} • Venue: {b.eventVenue || 'Madurai'}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        b.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        b.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#242433] flex justify-between items-center">
              <button
                onClick={() => handleDelete(selectedCustomer.id, selectedCustomer.name)}
                className="px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Customer</span>
              </button>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
