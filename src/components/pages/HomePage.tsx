import React from 'react';
import { 
  Camera, 
  Film, 
  Video, 
  Compass, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Award, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  Play
} from 'lucide-react';
import { HeroVideo } from '../HeroVideo';
import { HOME_SERVICES_HIGHLIGHT, STUDIO_INFO, SERVICES_LIST } from '../../data/studioData';
import { PageType } from '../../types';

interface HomePageProps {
  onNavigate: (page: PageType, serviceId?: string) => void;
  onSelectPhoto: (photoUrl: string, title: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectPhoto }) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5 text-[#d4af37]" />;
      case 'Film': return <Film className="w-5 h-5 text-[#d4af37]" />;
      case 'Video': return <Video className="w-5 h-5 text-[#d4af37]" />;
      case 'Compass': return <Compass className="w-5 h-5 text-[#d4af37]" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-[#d4af37]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[#d4af37]" />;
      default: return <Sparkles className="w-5 h-5 text-[#d4af37]" />;
    }
  };

  return (
    <div id="home-page-container" className="w-full">
      
      {/* ================================================== */}
      {/* CINEMATIC HERO SECTION */}
      {/* ================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#aa820a]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center relative z-10">
          
          {/* LEFT SIDE: Heading, Supporting Text, and Buttons */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Top Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14141c] border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="font-cinzel text-xs font-semibold uppercase tracking-[0.2em] text-[#f3e5ab]">
                NG DIGITAL STUDIO
              </span>
            </div>

            {/* Main Cinematic Heading */}
            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
              Add Glamour to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f7e7b4] to-[#d4af37]">
                Your Memories.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-sans-clean font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              We capture the emotions, celebrations and beautiful moments that make every story unforgettable.
            </p>

            {/* Buttons: Book Now (Gold Accent) and View Portfolio */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                id="hero-book-now-btn"
                onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-widest font-extrabold flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-view-portfolio-btn"
                onClick={() => onNavigate('portfolio')}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#111116] hover:bg-[#181822] text-white hover:text-[#f3e5ab] text-xs sm:text-sm uppercase tracking-wider font-semibold border border-neutral-700 hover:border-[#d4af37]/60 transition-all flex items-center justify-center gap-2"
              >
                <span>View Portfolio</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-neutral-900 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <div className="font-cinzel text-lg sm:text-xl font-bold text-[#d4af37]">1,450+</div>
                <div className="text-[11px] text-neutral-400">Events Documented</div>
              </div>
              <div>
                <div className="font-cinzel text-lg sm:text-xl font-bold text-[#d4af37]">4K UHD</div>
                <div className="text-[11px] text-neutral-400">Cinema Master Grade</div>
              </div>
              <div>
                <div className="font-cinzel text-lg sm:text-xl font-bold text-[#d4af37]">48 Hours</div>
                <div className="text-[11px] text-neutral-400">Fast Teaser Delivery</div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Prominently Display the NG Digital Studio Logo Video */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <HeroVideo onExploreClick={() => onNavigate('services')} />
          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* SHORT INTRODUCTION ABOUT NG DIGITAL STUDIO */}
      {/* ================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[#13131b] via-[#0f0f15] to-[#0a0a0f] border-2 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.22),inset_0_0_20px_rgba(212,175,55,0.06)] text-center space-y-5 relative overflow-hidden">
          
          {/* Subtle Ambient Golden Corner Accents */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <span className="inline-block text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean px-4 py-1 rounded-full bg-[#1b1b26] border border-[#d4af37]/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
              EXCELLENCE IN VISUAL ARTS
            </span>

            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-wide uppercase">
              A Legacy of Pure Cinematic Emotion
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base font-sans-clean font-light leading-relaxed max-w-3xl mx-auto">
              At <strong className="text-white font-semibold">NG Digital Studio</strong>, photography is not just about recording an occasion; it is the sacred art of freezing time, love, laughter, and heritage into timeless heirlooms. Operating from our flagship Madurai studio with state-of-the-art 4K cinema gear, drone pilots, and master colorists, we walk with you through every step — <span className="text-[#f3e5ab] italic font-serif-luxury text-base sm:text-lg">from the first booking call to the joy of flipping through your velvet Italian album.</span>
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171722] border border-[#d4af37]/30">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                Authentic Ritual Mastery
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171722] border border-[#d4af37]/30">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                Dedicated Candid Artists
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#171722] border border-[#d4af37]/30">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                Zero Disruption Flow
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ================================================== */}
      {/* HOME — SERVICES HIGHLIGHT */}
      {/* ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
            WHAT WE DO BEST
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
            Our Services
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-sans-clean">
            Six pillars of elite craftsmanship designed to elevate your celebrations into visual masterworks.
          </p>
        </div>

        {/* Six Premium Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HOME_SERVICES_HIGHLIGHT.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onNavigate('service-detail', item.serviceRef)}
              className="group relative rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-[#181610] via-[#121117] to-[#0c0c10] border border-[#d4af37]/45 hover:border-[#d4af37] hover:from-[#201c12] hover:to-[#121218] transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-[0_4px_25px_rgba(212,175,55,0.12),inset_0_1px_1px_rgba(212,175,55,0.2)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.28)] overflow-hidden"
            >
              {/* Golden Ambient Corner Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#d4af37]/15 rounded-bl-full blur-xl group-hover:bg-[#d4af37]/25 transition-all pointer-events-none" />
              {/* Top Golden Light Edge Accent */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />

              <div>
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#1c1912] border border-[#d4af37]/40 flex items-center justify-center group-hover:border-[#d4af37] group-hover:bg-[#d4af37]/20 shadow-[0_0_12px_rgba(212,175,55,0.15)] transition-all">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[10px] uppercase font-semibold font-mono tracking-wider px-2.5 py-1 rounded-full bg-[#1a1710] border border-[#d4af37]/40 text-[#f3e5ab] shadow-sm">
                    {item.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-300 text-xs sm:text-sm font-sans-clean font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between text-xs">
                <span className="text-[#d4af37] font-semibold group-hover:underline flex items-center gap-1">
                  Explore Service
                </span>
                <span className="w-7 h-7 rounded-full bg-[#1e1b12] border border-[#d4af37]/30 group-hover:border-[#d4af37] group-hover:bg-[#d4af37] text-[#d4af37] group-hover:text-black flex items-center justify-center transition-all shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services CTA */}
        <div className="mt-12 text-center">
          <button
            id="home-view-all-services-btn"
            onClick={() => onNavigate('services')}
            className="px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#f3e5ab] border border-[#d4af37]/40 hover:border-[#d4af37] text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center gap-2"
          >
            <span>View All 15 Specialized Services</span>
            <ChevronRight className="w-4 h-4 text-[#d4af37]" />
          </button>
        </div>

      </section>

      {/* ================================================== */}
      {/* VISUAL SHOWCASE STRIP */}
      {/* ================================================== */}
      <section className="py-16 bg-[#07070a] border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-semibold text-[#d4af37] tracking-[0.2em] uppercase">
                PORTFOLIO PREVIEW
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                Recent Masterpieces
              </h3>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
            >
              Open Complete Gallery <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Royal Muhurtham', cat: 'Wedding',img: '/images%20of%20studio/home%20wedding.jpg',},
              { title: 'Half-Saree Splendor', cat: 'Puberty', img: '/images%20of%20studio/puberty%20home.jpg' },
              { title: 'Golden Hour Coast', cat: 'Pre-Wedding', img: '/images%20of%20studio/prewedding%20home.jpg' },
              { title: '1st Birthday Joy', cat: 'Birthday', img: '/images%20of%20studio/birthday%20home.jpg' }
            ].map((p, idx) => (
              <div 
                key={idx}
                onClick={() => onNavigate('gallery')}
                className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-[#d4af37]/60 transition-all"
              >
                <img 
                  src={p.img} 
                  alt={p.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider">{p.cat}</span>
                  <h4 className="text-xs sm:text-sm font-cinzel font-bold text-white group-hover:text-[#f3e5ab] transition-colors">{p.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* BOTTOM CTA BANNER */}
      {/* ================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-b from-[#14141e] via-[#0f0f16] to-[#09090d] border-2 border-[#d4af37] shadow-[0_0_45px_rgba(212,175,55,0.25),inset_0_0_25px_rgba(212,175,55,0.06)] text-center space-y-6 relative z-10 overflow-hidden">
          
          {/* Subtle Ambient Golden Corner Highlights */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <span className="inline-block text-xs font-semibold text-[#d4af37] tracking-[0.3em] uppercase font-sans-clean px-4 py-1.5 rounded-full bg-[#1b1b26] border border-[#d4af37]/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
              RESERVE YOUR DATES TODAY
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight">
              Let’s Create Unforgettable Memories Together
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 font-sans-clean font-light max-w-2xl mx-auto leading-relaxed">
              Auspicious wedding dates and celebration slots fill up quickly. Schedule your customized studio package and lock in our master photography crew.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto px-9 py-4 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-widest font-extrabold shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                Book An Appointment Now
              </button>
              <button
                onClick={() => onNavigate('packages')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-[#f3e5ab] text-xs sm:text-sm uppercase tracking-wider font-semibold border border-[#d4af37]/40 hover:border-[#d4af37] transition-all"
              >
                Explore Wedding & Event Packages
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
