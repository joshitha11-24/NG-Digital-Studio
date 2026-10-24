import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Share2, MapPin, Tag } from 'lucide-react';
import { GalleryPhoto } from '../../types';

interface LightboxProps {
  photo: GalleryPhoto | null;
  photosList?: GalleryPhoto[];
  onClose: () => void;
  onSelectPhoto?: (photo: GalleryPhoto) => void;
  onBookThisStyle?: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  photosList = [],
  onClose,
  onSelectPhoto,
  onBookThisStyle
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photosList]);

  if (!photo) return null;

  const currentIndex = photosList.findIndex((p) => p.id === photo.id);

  const handleNext = () => {
    if (photosList.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % photosList.length;
    setIsZoomed(false);
    onSelectPhoto?.(photosList[nextIdx]);
  };

  const handlePrev = () => {
    if (photosList.length === 0 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + photosList.length) % photosList.length;
    setIsZoomed(false);
    onSelectPhoto?.(photosList[prevIdx]);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(photo.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      id="photo-lightbox-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 select-none"
    >
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-semibold uppercase tracking-wider">
            {photo.category}
          </span>
          <h4 className="text-sm sm:text-base font-cinzel font-bold text-white max-w-md truncate">
            {photo.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="lightbox-zoom-btn"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-lg bg-neutral-900/80 hover:bg-[#d4af37] text-neutral-300 hover:text-black transition-colors"
            title={isZoomed ? "Zoom Out" : "Zoom In"}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          <button
            id="lightbox-share-btn"
            onClick={handleShare}
            className="p-2 rounded-lg bg-neutral-900/80 hover:bg-[#d4af37] text-neutral-300 hover:text-black transition-colors relative"
            title="Share Photo Link"
          >
            <Share2 className="w-5 h-5" />
            {copied && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Link Copied!
              </span>
            )}
          </button>

          <a
            id="lightbox-download-link"
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            download={`${photo.title}.jpg`}
            className="p-2 rounded-lg bg-neutral-900/80 hover:bg-[#d4af37] text-neutral-300 hover:text-black transition-colors"
            title="Open Original Image"
          >
            <Download className="w-5 h-5" />
          </a>

          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-900/80 hover:bg-red-500 text-neutral-300 hover:text-white transition-colors ml-2"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden cursor-zoom-in"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={photo.url}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className={`max-h-[85vh] max-w-[90vw] object-contain rounded-lg transition-all duration-300 shadow-[0_0_50px_rgba(0,0,0,0.9)] ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'
          }`}
        />
      </div>

      {/* Navigation Chevrons */}
      {photosList.length > 1 && (
        <>
          <button
            id="lightbox-prev-btn"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-[#d4af37]/30 hover:border-[#d4af37]"
            title="Previous Image (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            id="lightbox-next-btn"
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-black transition-all border border-[#d4af37]/30 hover:border-[#d4af37]"
            title="Next Image (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-6 py-2.5 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/30 text-xs text-neutral-300">
        <span className="font-cinzel text-[#d4af37] font-semibold">
          NG DIGITAL STUDIO
        </span>
        {photo.location && (
          <span className="flex items-center gap-1 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            {photo.location}
          </span>
        )}
        {photosList.length > 0 && currentIndex !== -1 && (
          <span className="font-mono text-neutral-400">
            {currentIndex + 1} / {photosList.length}
          </span>
        )}
      </div>
    </div>
  );
};
