import React, { useEffect, useState } from 'react';
import { Camera, Sparkles, Filter, MapPin, ZoomIn, ArrowRight } from 'lucide-react';
import { GALLERY_PHOTOS } from '../../data/studioData';
import { GalleryCategory, GalleryPhoto, PageType } from '../../types';
import { api } from '../../../admin-panel/src/services/api';

const ADMIN_CATEGORY_MAP: Record<string, GalleryCategory> = {
  'Wedding': 'Wedding',
  'Birthday': 'Birthday',
  'Pre-Wedding': 'Pre-Wedding',
  'Post-Wedding': 'Wedding',
  'Outdoor Shoot': 'Outdoor',
  'Baby Shower': 'Baby',
  'Engagement': 'Events',
  'Housewarming': 'Events',
  'Product Shoot': 'Product',
};

interface PortfolioPageProps {
  onOpenLightbox: (photo: GalleryPhoto) => void;
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onOpenLightbox, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');

    const [adminPhotos, setAdminPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadAdminPhotos = async () => {
      try {
        const items = await api.getGallery();

        if (cancelled) return;

        const convertedPhotos: GalleryPhoto[] = items.map((item) => ({
          id: `admin-${item.id}`,
          url: item.imageUrl,
          title: item.title,
          category: ADMIN_CATEGORY_MAP[item.category] ?? 'Events',
          location: item.location || '',
          aspectRatio: 'landscape',
        })) as GalleryPhoto[];

        setAdminPhotos(convertedPhotos);
      } catch (error) {
        console.error('Failed to load admin gallery photos:', error);
      }
    };

    void loadAdminPhotos();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories: GalleryCategory[] = [
    'All',
    'Wedding',
    'Birthday',
    'Pre-Wedding',
    'Outdoor',
    'Puberty',
    'Baby',
    'Events',
    'Product'
  ];

  const allPhotos = [...GALLERY_PHOTOS, ...adminPhotos];

const filteredPhotos = allPhotos.filter((photo) => {
  if (activeCategory === 'All') return true;
  return photo.category === activeCategory;
});

  return (
    <div id="portfolio-page-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
          SIGNATURE CURATION
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Our Master Portfolio TEST
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-sans-clean">
          Explore a curated selection of our finest wedding Muhurthams, joyous half-saree ceremonies, golden hour couples, and commercial art.
        </p>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`portfolio-filter-${cat.toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                : 'bg-[#111116] text-neutral-400 hover:text-white border border-neutral-800 hover:border-[#d4af37]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry / Responsive Grid Gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onOpenLightbox(photo)}
            className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-[#d4af37] transition-all duration-500 shadow-xl bg-[#0e0e13]"
          >
            <img
              src={photo.url}
              alt={photo.title}
              referrerPolicy="no-referrer"
              className="w-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
            />

            {/* Ambient Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Hover Floating Zoom Icon */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
              <ZoomIn className="w-4 h-4" />
            </div>

            {/* Details Footer */}
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                  {photo.category}
                </span>
                {photo.location && (
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    {photo.location}
                  </span>
                )}
              </div>

              <h3 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-tight">
                {photo.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Book This Style CTA */}
      <div className="mt-16 text-center">
        <button
          onClick={() => onNavigate('booking')}
          className="px-8 py-4 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold shadow-[0_0_25px_rgba(212,175,55,0.35)]"
        >
          Book Your Event Photography
        </button>
      </div>

    </div>
  );
};
