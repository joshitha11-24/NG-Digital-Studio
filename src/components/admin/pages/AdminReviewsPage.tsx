import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  Filter 
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { AdminReview, ReviewStatus } from '../../../types/admin';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useAdmin();
  const [statusFilter, setStatusFilter] = useState<'All' | ReviewStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch = 
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete review from "${name}"?`)) {
      deleteReview(id);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
            TESTIMONIALS & FEEDBACK
          </span>
          <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
            Client Reviews Moderation
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Moderate, approve, and display authentic client feedback on the public studio website.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-emerald-900">
            {reviews.length} {reviews.length === 1 ? 'Live Review' : 'Live Reviews'}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or text..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'Approved', 'Pending', 'Rejected'] as const).map((st) => (
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
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS GRID / LIST */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-neutral-200/90 shadow-sm space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 text-[#aa820a] flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-neutral-800 font-cinzel">No Client Reviews Yet</p>
          <p className="text-xs text-neutral-500">
            {searchQuery || statusFilter !== 'All'
              ? 'No reviews match your search or filter.'
              : 'Client reviews submitted from the website will appear here in real time for approval and moderation.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-5 flex flex-col justify-between hover:border-[#d4af37]/60 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                
                {/* Client Info & Rating Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 font-cinzel">
                        {review.clientName}
                      </h3>
                      <span className="text-[11px] text-[#aa820a] font-medium block">
                        {review.service}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(review.status)}`}>
                      {review.status}
                    </span>
                    {review.location && (
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {review.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text Body */}
                <p className="text-xs text-neutral-700 italic bg-neutral-50/70 p-3 rounded-2xl border border-neutral-100 leading-relaxed">
                  "{review.reviewText}"
                </p>

                <div className="text-[10px] text-neutral-400">
                  Submitted on {review.date}
                </div>

              </div>

              {/* Moderation Buttons */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {review.status !== 'Approved' && (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'Approved')}
                      className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}

                  {review.status !== 'Rejected' && (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'Rejected')}
                      className="px-3 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(review.id, review.clientName)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-red-100 text-neutral-600 hover:text-red-600 transition-colors"
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
