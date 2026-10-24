import React from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  Sparkles, 
  CalendarCheck, 
  Users, 
  MessageSquare, 
  Star,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminNotificationsPage: React.FC = () => {
  const { 
    notifications, 
    unreadNotificationCount, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification,
    setActiveTab,
    setSelectedBookingId,
    setSelectedCustomerId
  } = useAdmin();

  const handleNotificationAction = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    if (n.targetTab) {
      setActiveTab(n.targetTab);
      if (n.targetTab === 'bookings' && n.targetId) {
        setSelectedBookingId(n.targetId);
      } else if (n.targetTab === 'customers' && n.targetId) {
        setSelectedCustomerId(n.targetId);
      }
    }
  };

  const getIcon = (type: typeof notifications[0]['type']) => {
    switch (type) {
      case 'booking':
        return <CalendarCheck className="w-4 h-4 text-emerald-600" />;
      case 'customer':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#d4af37]" />;
    }
  };

  return (
    <div className="space-y-6 font-sans-clean max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            REAL-TIME ACTIVITY
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Notifications Center
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time feed of new client bookings, reviews, inquiries, and customer registrations.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4 text-[#aa820a]" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm divide-y divide-neutral-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-16 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#aa820a] flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-neutral-800 font-cinzel">All Caught Up</p>
            <p className="text-xs text-neutral-500">
              No activity notifications yet. When new bookings, client messages, or reviews are submitted, live alerts will appear here.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.isRead ? 'bg-amber-50/30' : 'hover:bg-neutral-50/70'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5 border border-neutral-200">
                  {getIcon(n.type)}
                </div>
                
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-neutral-900">
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-[#d4af37] text-black text-[9px] font-extrabold uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-600">
                    {n.message}
                  </p>

                  <span className="text-[10px] text-neutral-400 block pt-0.5">
                    {n.timestamp}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {n.targetTab && (
                  <button
                    onClick={() => handleNotificationAction(n)}
                    className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3 text-[#aa820a]" />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
