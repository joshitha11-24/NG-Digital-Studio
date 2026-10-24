import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Filter, 
  Tag, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { SERVICES_LIST } from '../../data/studioData';
import { PageType, ServiceItem } from '../../types';

interface ServicesPageProps {
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Weddings', 'Birthdays', 'Tradition', 'Couple', 'Outdoors', 'Baby', 'Events', 'Product'];

  const filteredServices = SERVICES_LIST.filter((service) => {
    const matchesCategory = filterCategory === 'All' || service.categoryTag === filterCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="services-page-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
          COMPREHENSIVE CRAFTSMANSHIP
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Our Photography & Cinema Services
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-sans-clean">
          From sacred wedding Muhurthams to joyful milestones and high-fashion lookbooks, discover our 15 dedicated visual specializations.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0e0e14] p-3 sm:p-4 rounded-2xl border border-neutral-800">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-[#d4af37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-[#08080b] border border-neutral-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>
      </div>

      {/* Main 15 Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="group relative rounded-2xl bg-[#0f0f14] border border-neutral-800 hover:border-[#d4af37]/70 hover:bg-[#13131c] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-[0_15px_35px_rgba(212,175,55,0.15)] hover:-translate-y-1"
          >
            {/* Top Image Banner */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-transparent" />
              
              {/* Category & Pricing Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-[#d4af37]/40 text-[#f3e5ab] text-[10px] font-bold uppercase tracking-wider">
                  {service.categoryTag}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-md bg-[#121218]/90 border border-neutral-700 text-xs font-mono font-bold text-[#d4af37]">
                  From {service.startingPrice}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-[#f3e5ab] transition-colors leading-tight">
                  {service.name}
                </h3>
                <p className="text-xs text-neutral-400 font-sans-clean font-light leading-relaxed mt-2 line-clamp-3">
                  {service.shortDesc}
                </p>
              </div>

              {/* What we capture count */}
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#a39775]">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Includes {service.whatWeCapture.length} Key Ritual Highlights</span>
              </div>

              {/* Explore Button -> Links specifically to that service's portfolio! */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <button
                  id={`btn-explore-${service.id}`}
                  onClick={() => onNavigate('service-detail', service.id)}
                  className="w-full py-2.5 px-4 rounded-xl btn-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow"
                >
                  <span>Explore {service.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-16 text-center text-neutral-400 space-y-3">
          <p className="text-sm">No services found matching "{searchQuery}".</p>
          <button
            onClick={() => { setFilterCategory('All'); setSearchQuery(''); }}
            className="text-xs text-[#d4af37] underline"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Booking Prompt */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#121218] via-[#161622] to-[#121218] border border-[#d4af37]/30 text-center space-y-3">
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
          Require a Customized Multi-Event Photography Package?
        </h3>
        <p className="text-xs text-neutral-400 max-w-xl mx-auto">
          We offer bespoke bundles for multi-day weddings, consecutive housewarming & baby shower sessions, and commercial campaigns.
        </p>
        <button
          onClick={() => onNavigate('booking')}
          className="px-6 py-3 rounded-xl btn-gold text-xs uppercase tracking-wider font-bold shadow"
        >
          Book A Custom Consultation
        </button>
      </div>

    </div>
  );
};
