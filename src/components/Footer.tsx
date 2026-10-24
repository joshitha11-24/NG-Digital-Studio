import React from 'react';
import { 
  Instagram, 
  Facebook, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp,
  MessageCircle, 
  ShieldCheck, 
  Camera, 
  Sparkles
} from 'lucide-react';
import { LogoBranding } from './LogoBranding';
import { PageType } from '../types';
import { STUDIO_INFO, SERVICES_LIST } from '../data/studioData';

interface FooterProps {
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="relative bg-[#07070a] border-t border-[#d4af37]/20 pt-16 pb-12 overflow-hidden text-neutral-300">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <LogoBranding size="lg" showSlogan={true} />
            
            <p className="text-xs text-neutral-400 font-sans-clean leading-relaxed">
              We capture the emotions, celebrations and beautiful moments that make every story unforgettable. Preserving life’s sacred vows and joyful celebrations with cinematic grandeur.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                id="footer-whatsapp-link"
                href={STUDIO_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#121218] border border-neutral-800 hover:border-[#25D366] text-neutral-400 hover:text-[#25D366] flex items-center justify-center transition-all hover:scale-110"
                title="WhatsApp Direct Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                id="footer-instagram-link"
                href={STUDIO_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#121218] border border-neutral-800 hover:border-[#E1306C] text-neutral-400 hover:text-[#E1306C] flex items-center justify-center transition-all hover:scale-110"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                id="footer-facebook-link"
                href={STUDIO_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#121218] border border-neutral-800 hover:border-[#1877F2] text-neutral-400 hover:text-[#1877F2] flex items-center justify-center transition-all hover:scale-110"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                id="footer-maps-link"
                href="https://maps.google.com/?q=Madurai+Tamil+Nadu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#121218] border border-neutral-800 hover:border-[#d4af37] text-neutral-400 hover:text-[#d4af37] flex items-center justify-center transition-all hover:scale-110"
                title="Google Maps Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Home', page: 'home' as PageType },
                { name: 'About Us', page: 'about' as PageType },
                { name: 'Services', page: 'services' as PageType },
                { name: 'Portfolio', page: 'portfolio' as PageType },
                { name: 'Packages', page: 'packages' as PageType },
                { name: 'Gallery', page: 'gallery' as PageType },
                { name: 'Reviews', page: 'reviews' as PageType },
                { name: 'Contact', page: 'contact' as PageType },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => { onNavigate(link.page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-neutral-400 hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#d4af37]/60">›</span>
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Services */}
          <div>
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Key Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              {SERVICES_LIST.slice(0, 7).map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => { onNavigate('service-detail', s.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-neutral-400 hover:text-[#f3e5ab] transition-colors flex items-center gap-1.5 text-left truncate max-w-full"
                  >
                    <span className="text-[#d4af37]/60">›</span>
                    <span>{s.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Studio Contact & Location */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              Studio Details
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span className="text-neutral-400">{STUDIO_INFO.address}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
              <a href={`tel:${STUDIO_INFO.phone}`} className="text-neutral-400 hover:text-white transition-colors">
                {STUDIO_INFO.phone}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
              <a href={`mailto:${STUDIO_INFO.email}`} className="text-neutral-400 hover:text-white transition-colors">
                {STUDIO_INFO.email}
              </a>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              <span className="text-neutral-400">{STUDIO_INFO.hours}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { onNavigate('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-2 px-3 rounded-lg btn-gold text-xs font-bold uppercase tracking-wider shadow"
              >
                Book An Appointment
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p className="tracking-wide">
            © 2026 <span className="text-neutral-300 font-medium">NG Digital Studio</span>. All Rights Reserved.
          </p>

          <p className="text-[11px] text-neutral-400 font-cinzel">
            Add Glamour to Your Memories.
          </p>

          <div className="flex items-center gap-5">
            <a
              id="footer-admin-link"
              href="/admin"
              className="flex items-center gap-1.5 text-neutral-500 hover:text-[#d4af37] transition-colors text-[11px]"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]/70" />
              <span>Admin Portal</span>
            </a>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-neutral-400 hover:text-[#d4af37] transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
