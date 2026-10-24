import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { api, ReviewItem } from '../../services/api';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (status?: string) => {
    try {
      setLoading(true);
      const data = await api.getReviews(status);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(statusFilter);
  }, [statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      await api.approveReview(id);
      fetchReviews(statusFilter);
    } catch (err: any) {
      console.error('Error approving review:', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectReview(id);
      fetchReviews(statusFilter);
    } catch (err: any) {
      console.error('Error rejecting review:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      await api.deleteReview(id);
      fetchReviews(statusFilter);
    } catch (err: any) {
      console.error('Error deleting review:', err);
    }
  };

  const filterTabs = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121217] p-4 rounded-2xl border border-[#20202a]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-[#d4af37]" />
            Client Reviews Moderation
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Only approved reviews are published onto the customer-facing website.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`
                px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${statusFilter === tab
                  ? 'bg-[#d4af37] text-black font-extrabold shadow-sm'
                  : 'bg-[#181822] text-neutral-400 hover:text-white'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading client reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-[#121217] rounded-2xl border border-[#20202a] text-neutral-400 text-xs">
          No reviews currently in status &quot;{statusFilter}&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-[#121217] border border-[#20202a] hover:border-neutral-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.clientName)}`}
                      alt={r.clientName}
                      className="w-10 h-10 rounded-xl bg-neutral-800 object-cover border border-[#d4af37]/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{r.clientName}</h4>
                      <p className="text-[11px] text-[#d4af37] font-medium">{r.service}</p>
                      <p className="text-[10px] text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{r.location || 'Madurai'} • {r.createdAt}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                    r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    r.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}>
                    {r.status}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] text-neutral-400 ml-1.5 font-bold">
                    {r.rating}.0 / 5.0
                  </span>
                </div>

                {/* Review message */}
                <p className="text-xs text-neutral-300 italic bg-[#161622] p-3 rounded-xl border border-neutral-800/80 mb-4 leading-relaxed">
                  &quot;{r.reviewText}&quot;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1e1e2b]">
                <div className="flex items-center gap-2">
                  {r.status !== 'Approved' && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}

                  {r.status !== 'Rejected' && (
                    <button
                      onClick={() => handleReject(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
