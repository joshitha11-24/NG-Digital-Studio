import React from 'react';
import {
  Sparkles,
  Award,
  Heart,
  Clock,
  Eye,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { PageType } from '../../types';

interface AboutPageProps {
  onNavigate: (page: PageType, serviceId?: string) => void;
  onSelectPhoto: (url: string, title: string) => void;
}

const ABOUT_CAROUSEL_ITEMS = [
  {
    id: 'puberty-au',
    title: 'Half-Saree Ceremony',
    category: 'Puberty',
    image: '/images%20of%20studio/puberty%20au.jpg',
  },
  {
    id: 'bd-au',
    title: 'Birthday Celebrations',
    category: 'Birthday',
    image: '/images%20of%20studio/bd%20au.jpg',
  },
  {
    id: 'outdoor-au',
    title: 'Outdoor Photography',
    category: 'Outdoor',
    image: '/images%20of%20studio/outdor%20au.jpg',
  },
  {
    id: 'house-warming-au',
    title: 'House Warming',
    category: 'House Warming',
    image: '/images%20of%20studio/house%20warming%20au.jpg',
  },
  {
    id: 'pre-wedding-au',
    title: 'Pre-Wedding Photography',
    category: 'Pre-Wedding',
    image: '/images%20of%20studio/pre%20wedding%20au.jpg',
  },
  {
    id: 'wedding-au',
    title: 'Wedding Photography',
    category: 'Wedding',
    image: '/images%20of%20studio/wedding%20au.jpg',
  },
  {
    id: 'baby-shower-au',
    title: 'Baby Shower',
    category: 'Baby Shower',
    image: '/images%20of%20studio/baby%20shower%20au.jpg',
  },
];

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  onSelectPhoto,
}) => {
  // Duplicate the images to create a continuous carousel track.
  const carouselItems = [
    ...ABOUT_CAROUSEL_ITEMS,
    ...ABOUT_CAROUSEL_ITEMS,
  ];

  return (
    <div id="about-page-container" className="w-full pt-28 pb-20">

      {/* SECTION 1: ABOUT NG DIGITAL STUDIO */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">

        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
            ESTABLISHED IN PASSION & MASTERY
          </span>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-1 uppercase tracking-wide">
            About NG Digital Studio
          </h1>

          <p className="text-sm sm:text-base text-[#c5a059] font-serif-luxury italic mt-2">
            "Add Glamour to Your Memories."
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-[0_0_40px_rgba(212,175,55,0.2)]">

              <img
                src="/images%20of%20studio/img%20about%20us.jpg"
                alt="NG Digital Studio Master Photography"
                className="w-full aspect-[4/3] object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-[#d4af37]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white uppercase">
                    NG Digital Studio Flagship
                  </h4>

                  <p className="text-[11px] text-neutral-400">
                    12+ Years Documenting South Asian Milestones
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#d4af37]">
                    4K HDR CREW
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -top-5 -left-5 bg-[#121218] border-2 border-[#d4af37] text-white p-4 rounded-2xl shadow-2xl hidden sm:flex items-center gap-3">
              <div className="font-cinzel text-2xl font-black text-[#d4af37]">
                100%
              </div>

              <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-300">
                In-House Color <br />& Album Craft
              </div>
            </div>
          </div>

          {/* Text Description */}
          <div className="lg:col-span-6 space-y-5 text-neutral-300 font-sans-clean font-light leading-relaxed text-sm sm:text-base">

            <p>
              Welcome to{' '}
              <strong className="text-white font-semibold">
                NG Digital Studio
              </strong>
              , where every camera click is treated as an enduring work of fine
              art. Founded on the bedrock principle that true beauty lives in
              unrepeatable emotions, our studio has grown into one of the most
              trusted names in premier wedding and cultural celebration
              photography.
            </p>

            <p>
              We specialize in blending the richness of South Asian traditions
              — from the sanctity of early morning{' '}
              <span className="text-[#f3e5ab] font-medium">
                Muhurtham and sacred Mangalsutra rituals
              </span>{' '}
              to vibrant{' '}
              <span className="text-[#f3e5ab] font-medium">
                Half-Saree / Puberty ceremonies, Gruhapravesam, and birthday
                galas
              </span>{' '}
              — with the high-fashion cinematic aesthetics of international
              wedding cinema.
            </p>

            <p>
              Our dedicated team of master candid shooters, FAA-certified drone
              pilots, senior video editors, and handcrafted album artisans work
              with unobtrusive grace, ensuring your family feels comfortable,
              respected, and radiant throughout every single event.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-neutral-800">
                <span className="text-xl font-cinzel font-bold text-[#d4af37]">
                  1,450+
                </span>
                <p className="text-xs text-neutral-400">
                  Sacred Celebrations
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-neutral-800">
                <span className="text-xl font-cinzel font-bold text-[#d4af37]">
                  100%
                </span>
                <p className="text-xs text-neutral-400">
                  On-Time Album Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: OUR COMMITMENT */}
      <section className="py-16 bg-[#08080b] border-y border-neutral-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-semibold text-[#d4af37] tracking-[0.2em] uppercase">
              PILLARS OF TRUST
            </span>

            <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider">
              Our Commitment
            </h2>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
              Our core values govern every frame we compose and every family we
              welcome into our studio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Quality */}
            <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800 hover:border-[#d4af37]/60 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#181822] border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white uppercase mb-2">
                Quality
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans-clean">
                State-of-the-art cinema sensors, prime low-light glass, and
                master frequency separation skin retouching for flawless visual
                longevity.
              </p>
            </div>

            {/* Creativity */}
            <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800 hover:border-[#d4af37]/60 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#181822] border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white uppercase mb-2">
                Creativity
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans-clean">
                Unique editorial lighting concepts, romantic golden-hour
                framing, and bespoke 4K highlight films edited to your story.
              </p>
            </div>

            {/* Customer Satisfaction */}
            <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800 hover:border-[#d4af37]/60 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#181822] border border-neutral-800 text-[#d4af37] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white uppercase mb-2">
                Customer Satisfaction
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans-clean">
                Courteous, gentle crew members who honor family traditions,
                respect elders, and ensure zero disruption during sacred rites.
              </p>
            </div>

            {/* Timely Delivery */}
            <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800 hover:border-[#d4af37]/60 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#181822] border border-neutral-800 text-[#d4af37] flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>

              <h3 className="font-cinzel text-lg font-bold text-white uppercase mb-2">
                Timely Delivery
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans-clean">
                Rapid 48-hour social media teaser release and punctual delivery
                of handcrafted luxury albums and 4K masters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: VISION & MISSION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Our Vision */}
          <div className="relative rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-[#121218] to-[#0c0c10] border border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between group hover:border-[#d4af37] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] font-sans-clean">
                GUIDING LIGHT
              </span>

              <h3 className="font-cinzel text-2xl font-extrabold text-white uppercase">
                OUR VISION
              </h3>

              <blockquote className="text-base sm:text-lg text-neutral-200 font-serif-luxury italic leading-relaxed pt-2">
                "To preserve every special moment as a beautiful memory that
                lasts forever."
              </blockquote>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs text-[#d4af37] font-semibold">
              <span>Timeless Family Legacies</span>
            </div>
          </div>

          {/* Our Mission */}
          <div className="relative rounded-2xl p-8 sm:p-10 bg-gradient-to-br from-[#121218] to-[#0c0c10] border border-[#d4af37]/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between group hover:border-[#d4af37] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-[0.2em] font-sans-clean">
                OUR PROMISE
              </span>

              <h3 className="font-cinzel text-2xl font-extrabold text-white uppercase">
                OUR MISSION
              </h3>

              <blockquote className="text-base sm:text-lg text-neutral-200 font-serif-luxury italic leading-relaxed pt-2">
                "To provide creative, professional and reliable photography and
                videography services for every celebration."
              </blockquote>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center gap-2 text-xs text-[#d4af37] font-semibold">
              <span>Artistry • Honor • Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: AUTOMATIC HORIZONTAL MOVING IMAGE CAROUSEL */}
      <section className="py-16 bg-[#060608] border-t border-neutral-900 overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase">
            CONTINUOUS VISUAL REEL
          </span>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white uppercase mt-1">
            Celebrations in Continuous Motion
          </h2>

          <p className="text-xs text-neutral-400 mt-1">
            Hover over any frame to pause and inspect the fine details.
          </p>
        </div>

        {/* Continuous Horizontal Moving Carousel */}
        <div className="relative w-full overflow-hidden py-4">

          {/* Left Gradient Shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#060608] to-transparent z-10 pointer-events-none" />

          {/* Right Gradient Shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#060608] to-transparent z-10 pointer-events-none" />

          {/* Duplicated track for seamless scrolling */}
          <div className="animate-infinite-scroll flex w-max gap-6">
            {carouselItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectPhoto(item.image, item.title)}
                className="relative w-72 sm:w-80 h-96 shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-neutral-800 hover:border-[#d4af37] transition-all group shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#d4af37]/50 text-[#f3e5ab] text-[11px] font-bold uppercase tracking-wider shadow">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-tight">
                    {item.title}
                  </h4>

                  <span className="text-[10px] text-[#d4af37] font-semibold mt-1 inline-flex items-center gap-1">
                    Click to view high-res
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button
            onClick={() => onNavigate('booking')}
            className="px-8 py-3.5 rounded-xl btn-gold text-xs uppercase tracking-widest font-extrabold shadow-[0_0_25px_rgba(212,175,55,0.35)]"
          >
            Book Your Event With Us
          </button>
        </div>
      </section>
    </div>
  );
};