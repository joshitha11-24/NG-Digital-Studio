import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  ZoomIn, 
  MapPin, 
  Tag, 
  Filter, 
  Upload, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { GALLERY_PHOTOS } from '../../data/studioData';
import { GalleryCategory, GalleryPhoto, PageType } from '../../types';

interface GalleryPageProps {
  onOpenLightbox: (photo: GalleryPhoto) => void;
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenLightbox, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [customPhotos, setCustomPhotos] = useState<GalleryPhoto[]>([]);

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

  const allGallery = [...customPhotos, ...GALLERY_PHOTOS];

  const filteredPhotos = allGallery.filter((photo) => {
    if (selectedCategory === 'All') return true;
    return photo.category === selectedCategory;
  });

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const newPhoto: GalleryPhoto = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, "") || 'Client Sample Photo',
        category: selectedCategory === 'All' ? 'Wedding' : selectedCategory,
        url: imageUrl,
        description: 'Uploaded directly by client to preview studio curation aesthetic.',
        location: 'Studio Preview'
      };
      setCustomPhotos([newPhoto, ...customPhotos]);
    }
  };

  return (
    <div id="gallery-page-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
          IMMERSIVE VISUAL ARCHIVE
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Studio Gallery
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-sans-clean">
          Tap any photograph to open the full-screen cinematic lightbox viewer with high-resolution zooming and metadata.
        </p>
      </div>

      {/* Filter Tabs & Optional Client Uploader */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-neutral-900">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`gallery-cat-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                  : 'bg-[#111116] text-neutral-400 hover:text-white border border-neutral-800 hover:border-[#d4af37]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Upload Test Photo Action */}
        <label className="cursor-pointer px-4 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-[#d4af37] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors shrink-0">
          <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Upload Sample Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleCustomUpload}
            className="hidden"
          />
        </label>

      </div>

      {/* High-Resolution Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onOpenLightbox(photo)}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-neutral-800/80 hover:border-[#d4af37] transition-all duration-300 bg-[#0e0e13] shadow-lg hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)]"
          >
            {/* Image */}
            <img
              src={photo.url}
              alt={photo.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-95 transition-opacity" />

            {/* Category Tag (Top Left) */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-bold uppercase tracking-wider">
                {photo.category}
              </span>
            </div>

            {/* Zoom Icon (Top Right) */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
              <ZoomIn className="w-3.5 h-3.5" />
            </div>

            {/* Photo Details (Bottom) */}
            <div className="absolute bottom-3 left-3 right-3 z-10 text-left">
              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-tight">
                {photo.title}
              </h3>
              {photo.location && (
                <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#d4af37]" />
                  <span>{photo.location}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Book This Event Banner */}
      <div className="mt-16 text-center space-y-4">
        <p className="text-xs text-neutral-400">
          Loved what you see? Schedule your pre-wedding consultation or studio session with our master photographers.
        </p>
        <button
          onClick={() => onNavigate('booking')}
          className="px-8 py-3.5 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold shadow-[0_0_25px_rgba(212,175,55,0.35)]"
        >
          Book Your Photography Session
        </button>
      </div>

    </div>
  );
};
