import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  Film, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  Award,
  Layers,
  HelpCircle,
  PhoneCall,
  Check
} from 'lucide-react';
import { PACKAGES_DATA, CUSTOMIZABLE_PACKAGE_OPTIONS, STUDIO_INFO } from '../../data/studioData';
import { PackageItem, PageType, UserAccount } from '../../types';

interface PackagesPageProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onSelectPackageForBooking: (pkg: PackageItem, customizations?: string[]) => void;
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({
  currentUser,
  onOpenAuth,
  onSelectPackageForBooking,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'Wedding' | 'General'>('Wedding');
  
  // Track selected customizable options per package card
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({
    'pkg-budget': [],
    'pkg-luxury': [],
    'pkg-semi-luxury': [],
    'pkg-gen-budget': [],
    'pkg-gen-luxury': [],
    'pkg-gen-semi-luxury': []
  });

  const packages = activeTab === 'Wedding' ? PACKAGES_DATA.Wedding : PACKAGES_DATA.General;

  const toggleCustomization = (pkgId: string, option: string) => {
    setSelectedCustomizations((prev) => {
      const current = prev[pkgId] || [];
      const exists = current.includes(option);
      return {
        ...prev,
        [pkgId]: exists ? current.filter((item) => item !== option) : [...current, option]
      };
    });
  };

  const handleBookPackage = (pkg: PackageItem) => {
    if (!currentUser || !currentUser.isLoggedIn) {
      onOpenAuth();
    }
    const pkgCustomizations = selectedCustomizations[pkg.id] || [];
    onSelectPackageForBooking(pkg, pkgCustomizations);
  };

  return (
    <div id="packages-page-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
          TRANSPARENT VALUE & ARTISTRY
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Photography & Cinema Packages
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-sans-clean">
          Crafted without hidden costs. Browse our signature tiers complete with traditional & candid masters, HD video, custom 15 × 10 albums, pendrives, frames, and bags.
        </p>
      </div>

      {/* Tab Selector: Wedding vs General Celebrations */}
      <div className="flex items-center justify-center mb-12">
        <div className="bg-[#101016] p-1.5 rounded-2xl border border-neutral-800 flex gap-2">
          <button
            id="tab-wedding-packages"
            onClick={() => setActiveTab('Wedding')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'Wedding'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Wedding & Reception Packages
          </button>

          <button
            id="tab-general-packages"
            onClick={() => setActiveTab('General')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'General'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Birthdays, Puberty & Shoots
          </button>
        </div>
      </div>

      {/* Packages Cards Grid (Budget, Luxury, Semi-Luxury) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg) => {
          const pkgCustomizations = selectedCustomizations[pkg.id] || [];
          return (
            <div
              key={pkg.id}
              id={`package-card-${pkg.id}`}
              className={`relative rounded-3xl p-7 sm:p-9 border transition-all duration-300 flex flex-col justify-between ${
                pkg.popular
                  ? 'bg-[#141420] border-2 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.25)] md:-translate-y-2'
                  : 'bg-[#0e0e13] border-neutral-800 hover:border-[#d4af37]/60'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-extrabold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                  Most Popular Studio Choice
                </div>
              )}

              <div>
                {/* Package Name & Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-[#d4af37] tracking-wider">
                    {pkg.badge || 'Studio Tier'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                    Full Service
                  </span>
                </div>

                <h2 className="font-cinzel text-2xl font-extrabold text-white tracking-wide">
                  {pkg.name}
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-sans-clean">
                  {pkg.description}
                </p>

                {/* Base Price */}
                <div className="my-6 pb-6 border-b border-neutral-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-cinzel font-black text-[#d4af37] tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-neutral-500">/ Complete Event</span>
                  </div>
                  <span className="text-[11px] text-green-400 block mt-1">✓ Base Package Price • No Hidden Surcharges</span>
                </div>

                {/* Included Services List */}
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />
                    Included Services:
                  </span>
                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {pkg.features.map((serviceName, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-[#14141c]/60 p-2 rounded-lg border border-neutral-800/60">
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                        <span className="font-sans-clean font-medium text-neutral-200">{serviceName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ================================================== */}
                {/* 2. CUSTOMIZE YOUR PACKAGE (OPTIONAL SERVICES)      */}
                {/* ================================================== */}
                <div className="pt-5 border-t border-neutral-800/80 mb-6 bg-[#0a0a0e] p-4 rounded-2xl border border-neutral-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                      Customize Your Package
                    </span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                      Optional Add-ons
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 mb-3 font-sans-clean">
                    Select any optional enhancements to tailor your celebration:
                  </p>

                  <div className="space-y-2">
                    {CUSTOMIZABLE_PACKAGE_OPTIONS.map((opt) => {
                      const isChecked = pkgCustomizations.includes(opt);
                      return (
                        <label
                          key={opt}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                            isChecked
                              ? 'bg-[#1a1708] border-[#d4af37] text-white shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                              : 'bg-[#101016] border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCustomization(pkg.id, opt)}
                              className="w-4 h-4 rounded border-neutral-700 text-[#d4af37] focus:ring-[#d4af37] bg-neutral-900 cursor-pointer accent-[#d4af37]"
                            />
                            <span className="font-medium">{opt}</span>
                          </div>
                          <span className="text-[10px] text-[#c5a059] font-sans-clean">
                            Custom Pricing
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Informational Message */}
                  <div className="mt-3.5 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed font-sans-clean">
                    Want to customize your package? Select your preferred services and contact NG Digital Studio personally to discuss availability and additional charges.
                  </div>

                  {/* Contact Us for Customization Button */}
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="w-full mt-3 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-[#d4af37]/40 hover:border-[#d4af37] text-[#d4af37] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Contact Us for Customization</span>
                  </button>
                </div>

              </div>

              {/* Book This Package Button */}
              <div className="pt-2">
                <button
                  id={`btn-book-package-${pkg.id}`}
                  onClick={() => handleBookPackage(pkg)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    pkg.popular
                      ? 'btn-gold'
                      : 'bg-neutral-800 hover:bg-[#d4af37] text-white hover:text-black'
                  }`}
                >
                  <span>
                    {pkgCustomizations.length > 0
                      ? `Book ${pkg.name} (+${pkgCustomizations.length} Customization${pkgCustomizations.length > 1 ? 's' : ''})`
                      : `Book ${pkg.name}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {pkgCustomizations.length > 0 && (
                  <p className="text-[10px] text-center text-amber-400/90 mt-1.5 font-sans-clean">
                    * Additional charges for selected customizations will be discussed with the studio.
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Package Inclusions Guarantee Box */}
      <div className="mt-16 bg-[#0a0a0e] border border-[#d4af37]/30 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div className="space-y-1">
          <h4 className="font-cinzel text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            Master 10-Year Album Warranty
          </h4>
          <p className="text-xs text-neutral-400 font-sans-clean">
            Every photobook is thermal-laminated and bound with UV-resistant Japanese Fuji crystal archive paper.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="font-cinzel text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <Clock className="w-5 h-5 text-[#d4af37]" />
            Custom Photo Frame & Pendrive
          </h4>
          <p className="text-xs text-neutral-400 font-sans-clean">
            All tiers include an archival wooden photo frame, high-speed pendrive with high-resolution digital stills, and a protective bag.
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="font-cinzel text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
            <Award className="w-5 h-5 text-[#d4af37]" />
            Flexible Customizations
          </h4>
          <p className="text-xs text-neutral-400 font-sans-clean">
            Select Drone, Pre-Wedding, Post-Wedding, or Engagement shoots to tailor your celebration with direct studio consultation.
          </p>
        </div>
      </div>

    </div>
  );
};
