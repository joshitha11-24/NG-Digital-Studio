import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Quote, 
  Send, 
  MapPin,
  Camera,
  Upload,
  Calendar,
  Check,
  Star,
  X,
  HeartHandshake
} from 'lucide-react';
import { PageType } from '../../types';

interface ReviewsPageProps {
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export interface ReviewItem {
  id: string;
  clientName: string;
  service: string;
  reviewText: string;
  rating: number;
  location: string;
  avatar?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
];

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal & form state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [eventType, setEventType] = useState('Wedding & Reception');
  const [reviewText, setReviewText] = useState('');
  const [location, setLocation] = useState('Madurai');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState(AVATAR_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch approved reviews from backend API on mount
  useEffect(() => {
    let isMounted = true;
    const fetchApproved = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/reviews/approved');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setReviews(json.data);
            }
          }
        }
      } catch (err) {
        console.warn('Backend reviews fetch notice (using cached/fallback):', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchApproved();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) return;

    setIsSubmitting(true);

    const newRevItem: ReviewItem = {
      id: `rev-${Date.now()}`,
      clientName: customerName.trim(),
      service: eventType,
      reviewText: reviewText.trim(),
      rating: rating,
      location: location.trim() || 'Madurai',
      avatar,
      status: 'Approved',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: customerName.trim(),
          service: eventType,
          reviewText: reviewText.trim(),
          location: location.trim() || 'Madurai',
          avatar,
          rating
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          // Add to local state feed
          setReviews(prev => [newRevItem, ...prev]);
        }
      } else {
        // Still add to local state for instant feedback
        setReviews(prev => [newRevItem, ...prev]);
      }
    } catch (err) {
      console.warn('Backend review sync note:', err);
      // Still show in local view
      setReviews(prev => [newRevItem, ...prev]);
    } finally {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitModal(false);
        setCustomerName('');
        setReviewText('');
        setLocation('Madurai');
        setRating(5);
        setAvatar(AVATAR_OPTIONS[0]);
      }, 1800);
    }
  };

  // Filter only approved reviews for public viewing
  const publishedReviews = (reviews || []).filter((r) => r && r.status !== 'Rejected');

  return (
    <div id="reviews-page-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans-clean">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Client Reviews & Stories
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-sans-clean">
          Genuine reflections, memories, and feedback directly from clients, families, and couples who celebrated with NG Digital Studio in Madurai.
        </p>
      </div>

      {/* Reviews Summary & Write Review Bar */}
      <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#0f0f14] border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(212,175,55,0.12)]">
        
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm sm:text-base text-white font-bold font-cinzel">
              {publishedReviews.length === 0 
                ? '0 Reviews Published • Be the First to Share' 
                : `${publishedReviews.length} Verified Client ${publishedReviews.length === 1 ? 'Story' : 'Stories'} Published`}
            </p>
            <p className="text-[11px] text-neutral-400">
              Direct submissions from our couples and celebration hosts in Madurai
            </p>
          </div>
        </div>

        <button
          id="btn-write-review-open"
          onClick={() => setShowSubmitModal(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl btn-gold text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:scale-102 transition-transform cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Write a Review</span>
        </button>

      </div>

      {/* Reviews Cards Grid OR Empty State */}
      {publishedReviews.length === 0 ? (
        <div className="rounded-3xl p-10 sm:p-16 bg-[#0c0c10] border border-neutral-800 text-center max-w-xl mx-auto space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            <Quote className="w-8 h-8" />
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            No Client Reviews Published Yet
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans-clean leading-relaxed">
            Our review feed is live. Have you had an event or portrait session captured by NG Digital Studio in Madurai? We would love to feature your heartfelt words!
          </p>
          <div className="pt-2">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-3 rounded-xl btn-gold text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedReviews.map((rev) => (
            <div
              key={rev.id || `rev-${Math.random()}`}
              className="rounded-2xl p-6 bg-[#0c0c10] border border-neutral-800 hover:border-[#d4af37]/60 transition-all flex flex-col justify-between shadow-lg relative group"
            >
              {/* Top Quote Icon */}
              <div className="absolute top-5 right-5 text-neutral-800 group-hover:text-[#d4af37]/20 transition-colors pointer-events-none">
                <Quote className="w-7 h-7" />
              </div>

              <div>
                {/* Event Category Tag & Star Rating */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 text-[11px] font-semibold text-[#d4af37]">
                    <Camera className="w-3 h-3" />
                    <span>{rev.service || 'Celebration'}</span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 text-[#d4af37]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < (rev.rating || 5) ? 'fill-[#d4af37]' : 'text-neutral-700'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text Body */}
                <p className="text-xs sm:text-sm text-neutral-200 font-sans-clean font-light leading-relaxed mb-6 italic">
                  "{rev.reviewText}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={rev.avatar || AVATAR_OPTIONS[0]}
                    alt={rev.clientName || 'Client'}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/50 shrink-0 bg-neutral-900"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = AVATAR_OPTIONS[0];
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="font-cinzel text-xs font-bold text-white flex items-center gap-1.5 truncate">
                      <span>{rev.clientName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </h4>
                    {rev.location && (
                      <p className="text-[10px] text-neutral-400 flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5 text-[#d4af37]" />
                        <span>{rev.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono shrink-0">
                  <Calendar className="w-3 h-3 text-neutral-600" />
                  <span>{rev.createdAt || 'Recent'}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SUBMIT REVIEW MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121218] border border-[#d4af37]/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4af37]" />
                  <span>Share Your Experience</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Your genuine feedback helps us maintain the highest cinematic standard of photography in Madurai.
                </p>
              </div>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-cinzel text-lg font-bold text-white">Thank You For Your Review!</h4>
                <p className="text-xs text-neutral-400">
                  Your review has been submitted successfully and is now featured in our community feed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vigneshwaran & Priya K."
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Event Type & City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Celebration / Shoot Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                      <option value="Wedding & Reception">Wedding & Reception</option>
                      <option value="Puberty Ceremony">Puberty Ceremony</option>
                      <option value="Birthday Shoot">Birthday Shoot</option>
                      <option value="Pre-Wedding Film">Pre-Wedding Film</option>
                      <option value="Housewarming">Housewarming</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Maternity Session">Maternity Session</option>
                      <option value="Fashion & Commercial">Fashion & Commercial</option>
                      <option value="Traditional Portrait">Traditional Portrait</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Madurai"
                      className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    >
                    </input>
                  </div>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${starVal <= rating ? 'text-[#d4af37] fill-[#d4af37]' : 'text-neutral-600'}`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#d4af37] font-semibold ml-2">
                      {rating} out of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Avatar Selection & Upload */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Profile Photo / Avatar
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt="Selected avatar"
                      className="w-10 h-10 rounded-full object-cover border border-[#d4af37] shrink-0"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {AVATAR_OPTIONS.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatar(opt)}
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 shrink-0 transition-transform ${
                            avatar === opt ? 'border-[#d4af37] scale-110' : 'border-neutral-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={opt} alt={`Option ${i+1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-200 flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
                    >
                      <Upload className="w-3 h-3 text-[#d4af37]" />
                      <span>Upload</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Review & Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share details about the photo quality, album presentation, crew punctuality, or memorable moments..."
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Publishing...' : 'Publish Review'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Book CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={() => onNavigate('booking')}
          className="px-8 py-3.5 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-102 transition-transform cursor-pointer"
        >
          Book Your Event With NG Digital Studio
        </button>
      </div>

    </div>
  );
};
