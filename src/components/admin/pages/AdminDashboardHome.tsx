import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  Star, 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  Eye, 
  TrendingUp, 
  PlusCircle, 
  ChevronRight,
  Sparkles,
  Phone
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminBooking } from '../../../types/admin';

export const AdminDashboardHome: React.FC = () => {
  const { 
    adminUser,
    stats, 
    bookings, 
    customers, 
    messages,
    setActiveTab, 
    setSelectedBookingId, 
    setSelectedCustomerId,
    studioSettings 
  } = useAdmin();

  const recentBookings = [...bookings].slice(0, 5);
  const upcomingEvents = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
    .slice(0, 4);

  const getStatusBadge = (status: AdminBooking['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const handleViewBooking = (b: AdminBooking) => {
    setSelectedBookingId(b.id);
    setActiveTab('bookings');
  };

  return (
    <div className="space-y-8 font-sans-clean">
      
      {/* Top Welcome & Subheading Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            STUDIO CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-cinzel">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Welcome back, <span className="font-semibold text-neutral-800">{adminUser.name}</span>. Here is your real-time studio overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Manage Bookings</span>
          </button>
          
          <button
            onClick={() => setActiveTab('customers')}
            className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-2 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-neutral-500" />
            <span>View Customers</span>
          </button>
        </div>
      </div>

      {/* 6 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Total Customers */}
        <div 
          onClick={() => setActiveTab('customers')}
          className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-[#d4af37]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Customers</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 font-cinzel">
              {stats.totalCustomers}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Active studio base</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div 
          onClick={() => setActiveTab('bookings')}
          className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-[#d4af37]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#aa820a] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 font-cinzel">
              {stats.totalBookings}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              All lifetime records
            </div>
          </div>
        </div>

        {/* Card 3: Pending Bookings */}
        <div 
          onClick={() => setActiveTab('bookings')}
          className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/20 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-900">Pending Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-900 font-cinzel">
              {stats.pendingBookings}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Requires review & confirmation
            </div>
          </div>
        </div>

        {/* Card 4: Confirmed Bookings */}
        <div 
          onClick={() => setActiveTab('bookings')}
          className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Confirmed Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 font-cinzel">
              {stats.confirmedBookings}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Scheduled & locked
            </div>
          </div>
        </div>

        {/* Card 5: Inquiries / Messages */}
        <div 
          onClick={() => setActiveTab('messages')}
          className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 font-cinzel">
              {messages.length}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Client messages & queries
            </div>
          </div>
        </div>

        {/* Card 6: Total Reviews */}
        <div 
          onClick={() => setActiveTab('reviews')}
          className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-sm hover:border-[#d4af37]/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-neutral-900 font-cinzel">
              {stats.totalReviews}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              {stats.totalReviews > 0 ? `${stats.totalReviews} Published live` : 'Live client feedback'}
            </div>
          </div>
        </div>

      </div>

      {/* TWO COLUMN CONTENT: RECENT BOOKINGS TABLE & UPCOMING EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLUMNS: RECENT BOOKINGS */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-cinzel">
                Recent Bookings
              </h2>
              <p className="text-xs text-neutral-500">
                Latest client reservations and photo shoot schedules
              </p>
            </div>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs font-semibold text-[#aa820a] hover:text-neutral-900 flex items-center gap-1"
            >
              <span>View All ({bookings.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm overflow-hidden">
            {recentBookings.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-[#aa820a] flex items-center justify-center mx-auto">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel text-base font-bold text-neutral-800">
                  Live Studio Dashboard Ready
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  No bookings registered yet. When clients book milestones on the website or you add manual entries, they will appear here in real time.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Create New Booking</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Booking ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Package</th>
                      <th className="py-3.5 px-4">Event Date</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {recentBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#aa820a]">
                          {b.bookingId}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={b.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                              alt={b.customerName}
                              className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                            />
                            <span className="font-bold text-neutral-900 truncate max-w-[120px]">{b.customerName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700 truncate max-w-[130px]">
                          {b.service}
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px]">
                            {b.package.replace(' Package', '')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-700 whitespace-nowrap">
                          {b.eventDate}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          {b.amount}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleViewBooking(b)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-[#aa820a]" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT 1 COLUMN: UPCOMING EVENTS */}
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900 font-cinzel">
                Upcoming Events
              </h2>
              <p className="text-xs text-neutral-500">
                Scheduled celebrations & venue assignments
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-sm text-center space-y-2">
                <Calendar className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="font-cinzel text-xs font-bold text-neutral-800">
                  No Upcoming Events
                </h4>
                <p className="text-[11px] text-neutral-500">
                  Confirmed celebrations and schedules will be listed here automatically.
                </p>
              </div>
            ) : (
              upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleViewBooking(evt)}
                  className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-sm hover:border-[#d4af37]/60 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#aa820a] transition-colors">
                        {evt.customerName}
                      </h4>
                      <span className="text-[11px] text-[#aa820a] font-medium block">
                        {evt.service} • {evt.package}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(evt.status)}`}>
                      {evt.status}
                    </span>
                  </div>

                  <div className="pt-2.5 space-y-1.5 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-semibold text-neutral-800">{evt.eventDate}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 text-[11px]">{evt.venue}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-[#aa820a] font-bold">{evt.bookingId}</span>
                    <span className="font-bold text-neutral-900">{evt.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
