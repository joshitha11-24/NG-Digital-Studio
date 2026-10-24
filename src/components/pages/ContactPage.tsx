import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { STUDIO_INFO } from '../../data/studioData';
import { PageType } from '../../types';

interface ContactPageProps {
  onNavigate: (page: PageType, serviceId?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Wedding Photography');
  const [eventDate, setEventDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleSendViaWhatsApp = () => {
    const msg = `*NG DIGITAL STUDIO - GENERAL INQUIRY*%0A%0A*Name:* ${name || 'Prospective Client'}%0A*Phone:* ${phone}%0A*Event:* ${eventType}%0A*Date:* ${eventDate || 'Upcoming'}%0A*Message:* ${message || 'I would like to inquire about packages.'}`;
    window.open(`https://wa.me/${STUDIO_INFO.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div id="contact-page-container" className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-semibold text-[#d4af37] tracking-[0.25em] uppercase font-sans-clean">
          GET IN TOUCH WITH OUR MASTER CREW
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold text-white uppercase tracking-wide">
          Contact NG Digital Studio
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto font-sans-clean">
          We would love to welcome you to our studio for a warm cup of coffee and an album consultation, or discuss your celebration dates via call or WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Cards & Studio Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800 space-y-6">
            <h3 className="font-cinzel text-lg font-bold text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              Studio Coordinates
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#171722] text-[#d4af37] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-semibold block">Studio Location</span>
                <p className="text-xs sm:text-sm text-white mt-0.5 leading-relaxed">{STUDIO_INFO.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#171722] text-[#d4af37] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-semibold block">Studio Direct Line</span>
                <a href={`tel:${STUDIO_INFO.phone}`} className="text-xs sm:text-sm text-white font-mono hover:text-[#d4af37] transition-colors">
                  {STUDIO_INFO.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#171722] text-[#d4af37] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-semibold block">Official Inquiries</span>
                <a href={`mailto:${STUDIO_INFO.email}`} className="text-xs sm:text-sm text-white hover:text-[#d4af37] transition-colors">
                  {STUDIO_INFO.email}
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#171722] text-[#d4af37] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-neutral-400 font-semibold block">Studio Hours</span>
                <p className="text-xs sm:text-sm text-white">{STUDIO_INFO.hours}</p>
              </div>
            </div>

          </div>

          {/* Direct Social Channels */}
          <div className="p-6 rounded-2xl bg-[#0f0f14] border border-neutral-800 space-y-4">
            <h4 className="font-cinzel text-sm font-bold text-white uppercase">
              Instant Social Channels
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <a
                href={STUDIO_INFO.whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#13131c] border border-neutral-800 hover:border-[#25D366] text-center flex flex-col items-center gap-1 text-neutral-300 hover:text-[#25D366] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </a>

              <a
                href={STUDIO_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#13131c] border border-neutral-800 hover:border-[#E1306C] text-center flex flex-col items-center gap-1 text-neutral-300 hover:text-[#E1306C] transition-all"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-[10px] font-bold">Instagram</span>
              </a>

              <a
                href={STUDIO_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#13131c] border border-neutral-800 hover:border-[#1877F2] text-center flex flex-col items-center gap-1 text-neutral-300 hover:text-[#1877F2] transition-all"
              >
                <Facebook className="w-5 h-5" />
                <span className="text-[10px] font-bold">Facebook</span>
              </a>
            </div>
          </div>



        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-[#0f0f14] border border-[#d4af37]/40 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative">
            
            {formSubmitted ? (
              <div className="text-center py-16 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#f3e5ab] text-black flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-white uppercase">
                  Inquiry Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
                  Thank you, <strong className="text-[#f3e5ab]">{name || 'valued customer'}</strong>. Our senior photography consultant will review your event details and respond within 2 business hours.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleSendViaWhatsApp}
                    className="px-6 py-2.5 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ping Studio on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => { setFormSubmitted(false); setName(''); setMessage(''); }}
                    className="px-6 py-2.5 rounded-xl bg-neutral-800 text-white text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase">
                    Send Studio Inquiry
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Fill in your celebration details to check crew availability and request personalized package quotations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Your Full Name *</label>
                    <input
                      id="contact-form-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand Kumar"
                      className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      id="contact-form-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98402 12345"
                      className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address *</label>
                    <input
                      id="contact-form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Anticipated Event Date</label>
                    <input
                      id="contact-form-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Service Required</label>
                  <select
                    id="contact-form-service"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Wedding & Reception">Wedding & Reception Photography</option>
                    <option value="Puberty Ceremony">Puberty / Half-Saree Ceremony</option>
                    <option value="Birthday Shoot">Birthday Photography</option>
                    <option value="Pre-Wedding Film">Pre-Wedding Shoot & Film</option>
                    <option value="Baby Shower / Newborn">Baby Shower / Newborn Portraits</option>
                    <option value="Housewarming">Housewarming (Gruhapravesam)</option>
                    <option value="Commercial / Product">Commercial / Fashion / Product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Your Message or Custom Requests</label>
                  <textarea
                    id="contact-form-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the event venue, specific traditions, or package questions..."
                    className="w-full bg-[#08080b] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl btn-gold text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 shadow"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
