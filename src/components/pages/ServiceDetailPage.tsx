import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Camera, 
  Film, 
  Sparkles, 
  Play, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon, 
  Calendar, 
  ShieldCheck,
  Star
} from 'lucide-react';
import { SERVICES_LIST, PACKAGES_DATA } from '../../data/studioData';
import { PageType, ServiceItem } from '../../types';

interface ServiceDetailPageProps {
  serviceId: string;
  onNavigate: (page: PageType, serviceId?: string) => void;
  onSelectPhoto: (url: string, title: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onNavigate,
  onSelectPhoto
}) => {
  const service = SERVICES_LIST.find((s) => s.id === serviceId) || SERVICES_LIST[0];
  const [videoMuted, setVideoMuted] = useState(true);

  // Relevant packages
  const packages = service.categoryTag === 'Weddings' 
    ? PACKAGES_DATA.Wedding 
    : PACKAGES_DATA.General;

  return (
    <div id="service-detail-page" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* ================================================== */}
      {/* HERO SECTION */}
      {/* ================================================== */}
      <section className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#0d0d12] shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        
        {/* Background Image Banner with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-[#0d0d12]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d12] via-[#0d0d12]/80 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('services')}
              className="text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Services
            </button>
            <span className="text-neutral-600">/</span>
            <span className="text-[#d4af37] font-semibold uppercase tracking-wider">{service.categoryTag}</span>
          </div>

          {/* Hero Heading & Subtitle */}
          <div>
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight leading-tight">
              {service.name}
            </h1>
            <p className="text-base sm:text-xl text-[#f3e5ab] font-serif-luxury italic mt-3">
              "{service.heroSubtitle}"
            </p>
          </div>

          {/* Highlights & CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id={`btn-book-service-${service.id}`}
              onClick={() => onNavigate('booking', service.id)}
              className="px-8 py-3.5 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-widest font-extrabold flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book This Service</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('service-packages-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs sm:text-sm uppercase tracking-wider font-semibold border border-neutral-700 hover:border-[#d4af37]/60 transition-colors"
            >
              View Packages & Pricing
            </button>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 1. ABOUT THIS SERVICE */}
      {/* ================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <div className="lg:col-span-7 space-y-4 text-neutral-300 font-sans-clean font-light leading-relaxed text-sm sm:text-base">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.2em] uppercase">
            STUDIO SPECIALIZATION
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white uppercase">
            About {service.name}
          </h2>
          <p>{service.fullDesc}</p>
          
          <ul className="space-y-2.5 pt-2 text-xs sm:text-sm">
            {service.includedHighlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-2 text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl">
            <img
              src={service.whatWeCapture[0]?.image || service.image}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[#121218] border border-[#d4af37]/60 p-3 rounded-xl shadow-xl hidden sm:block">
            <div className="text-[10px] text-neutral-400 uppercase font-mono">Pricing Starting From</div>
            <div className="font-cinzel text-lg font-bold text-[#d4af37]">{service.startingPrice}</div>
          </div>
        </div>

      </section>

      {/* ================================================== */}
      {/* 2. WHAT WE CAPTURE (6 CARDS) */}
      {/* ================================================== */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase">
            CURATED MOMENTS
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wide">
            What We Capture
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Six comprehensive perspectives ensuring every vital ritual, detail, and emotion is honored.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.whatWeCapture.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl bg-[#0f0f14] border border-neutral-800 hover:border-[#d4af37]/60 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(212,175,55,0.15)]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-[#d4af37] border border-[#d4af37]/30">
                  0{idx + 1}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-[#f3e5ab] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-400 font-sans-clean font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. FEATURED SERVICE GALLERY & LIGHTBOX */}
      {/* ================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#d4af37] tracking-[0.2em] uppercase">
              VISUAL SAMPLES
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-white mt-0.5">
              Featured {service.name} Gallery
            </h2>
          </div>

          {/* 5. Full Gallery Button */}
          <button
            id="btn-full-gallery-from-service"
            onClick={() => onNavigate('gallery')}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>View Full Studio Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {service.featuredGallery.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo.url, photo.title)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-[#d4af37] transition-all shadow-md"
            >
              <img
                src={photo.url}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-[#d4af37] font-bold uppercase">{photo.tag}</span>
                <p className="text-xs font-cinzel text-white font-bold">{photo.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================== */}
      {/* 4. SERVICE HIGHLIGHT VIDEO */}
      {/* ================================================== */}
      <section className="relative rounded-3xl overflow-hidden border border-[#d4af37]/40 bg-[#09090c] p-6 sm:p-10 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase">
            CINEMATIC FILM REEL
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white uppercase">
            {service.name} Film Teaser
          </h2>
          <p className="text-xs text-neutral-400">
            Shot on Cinema 4K Cameras with 10-Bit Color Depth & Anamorphic Glass.
          </p>
        </div>

        <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-black">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted={videoMuted}
            loop
            playsInline
            poster={service.image}
          >
            <source 
              src={service.highlightVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} 
              type="video/mp4" 
            />
          </video>

          {/* Sound Toggle Overlay Button */}
          <button
            onClick={() => setVideoMuted(!videoMuted)}
            className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/50 text-white hover:text-[#d4af37] text-xs flex items-center gap-2 transition-colors"
          >
            {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{videoMuted ? 'Unmute Film Audio' : 'Mute'}</span>
          </button>
        </div>
      </section>

      {/* ================================================== */}
      {/* 6. SERVICE PACKAGES */}
      {/* ================================================== */}
      <section id="service-packages-section" className="space-y-8 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase">
            PRICING TIERS
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-wide">
            {service.name} Packages
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Choose the package best suited to your celebration scope. Anyone can view without signing in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 sm:p-8 border transition-all flex flex-col justify-between ${
                pkg.popular
                  ? 'bg-[#151520] border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.25)]'
                  : 'bg-[#0f0f14] border-neutral-800 hover:border-[#d4af37]/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="font-cinzel font-bold text-xl text-white">{pkg.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{pkg.description}</p>
                
                <div className="my-6">
                  <span className="text-3xl font-cinzel font-extrabold text-[#d4af37]">{pkg.price}</span>
                  <span className="text-xs text-neutral-500 ml-1">/ Complete Coverage</span>
                </div>

                <div className="space-y-2 text-xs border-y border-neutral-800/80 py-4 mb-6 text-neutral-300">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Crew:</span>
                    <span className="font-semibold text-right">{pkg.photographers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Album:</span>
                    <span className="font-semibold text-right truncate max-w-[170px]">{pkg.albumDetails}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Delivery:</span>
                    <span className="font-semibold text-green-400">{pkg.deliveryTime}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300 mb-6">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 7. Book This Service Button */}
              <button
                id={`btn-book-pkg-${pkg.id}`}
                onClick={() => onNavigate('booking', service.id)}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  pkg.popular
                    ? 'btn-gold shadow-md'
                    : 'bg-neutral-800 hover:bg-[#d4af37] text-white hover:text-black'
                }`}
              >
                <span>Book This Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Sticky Action Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#121218] via-[#1a1a28] to-[#121218] border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-white">
            Ready to Capture Your {service.name}?
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Connect with our creative team to reserve your wedding or event date today.
          </p>
        </div>

        <button
          onClick={() => onNavigate('booking', service.id)}
          className="px-8 py-3.5 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold whitespace-nowrap shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          Book This Service
        </button>
      </div>

    </div>
  );
};
