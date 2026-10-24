import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  DollarSign, 
  Globe, 
  CheckCircle2, 
  Save, 
  Share2,
  BellRing,
  Database,
  Trash2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';

export const AdminSettingsPage: React.FC = () => {
  const { studioSettings, updateStudioSettings, clearAllData, bookings, customers, messages, reviews } = useAdmin();

  const [name, setName] = useState(studioSettings.name);
  const [tagline, setTagline] = useState(studioSettings.tagline);
  const [email, setEmail] = useState(studioSettings.email);
  const [phone, setPhone] = useState(studioSettings.phone);
  const [address, setAddress] = useState(studioSettings.address);
  const [workingHours, setWorkingHours] = useState(studioSettings.workingHours);
  const [currencySymbol, setCurrencySymbol] = useState(studioSettings.currencySymbol);
  const [autoConfirmBookings, setAutoConfirmBookings] = useState(studioSettings.autoConfirmBookings);
  const [notificationEmail, setNotificationEmail] = useState(studioSettings.notificationEmail);
  const [instagram, setInstagram] = useState(studioSettings.socialLinks.instagram);
  const [facebook, setFacebook] = useState(studioSettings.socialLinks.facebook);
  const [youtube, setYoutube] = useState(studioSettings.socialLinks.youtube);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudioSettings({
      name,
      tagline,
      email,
      phone,
      address,
      workingHours,
      currencySymbol,
      autoConfirmBookings,
      notificationEmail,
      socialLinks: {
        instagram,
        facebook,
        youtube
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to reset all live entries (bookings, customers, reviews, messages)? This will return the dashboard to a completely fresh state.')) {
      clearAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-6 font-sans-clean max-w-4xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-neutral-200">
        <span className="text-[11px] font-bold text-[#aa820a] uppercase tracking-widest">
          STUDIO CONFIGURATION
        </span>
        <h1 className="text-2xl font-extrabold text-neutral-900 font-cinzel">
          Studio Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure business credentials, physical studio address, booking automated behaviors, and social links.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Studio settings updated and saved successfully!</span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-[#aa820a] shrink-0" />
          <span>Live data cleared successfully! Dashboard is now 100% clean and live ready.</span>
        </div>
      )}

      {/* Live State & Data Management Card */}
      <div className="bg-gradient-to-r from-amber-50/60 to-white rounded-3xl border border-[#d4af37]/40 p-6 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#aa820a] text-[#f3e5ab] flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 font-cinzel">Live Production Mode Active</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                Predefined demo records removed. All data reflects real-time client activity and manual admin submissions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClearData}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold border border-neutral-200 hover:border-red-200 transition-colors flex items-center gap-1.5 text-xs shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Live Records</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-amber-200/50 text-center">
          <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200/80">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Bookings</span>
            <span className="text-base font-bold text-neutral-900 font-cinzel">{bookings.length}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200/80">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Customers</span>
            <span className="text-base font-bold text-neutral-900 font-cinzel">{customers.length}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200/80">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Messages</span>
            <span className="text-base font-bold text-neutral-900 font-cinzel">{messages.length}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-neutral-200/80">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Reviews</span>
            <span className="text-base font-bold text-neutral-900 font-cinzel">{reviews.length}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* General Business Information */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-cinzel flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#aa820a]" />
            <span>Studio Identity & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Studio Brand Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 font-cinzel font-bold focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Public Studio Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Public Phone / Booking Line</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Studio Physical Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Studio Working Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Automated Booking & Notification Rules */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-cinzel flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#aa820a]" />
            <span>Booking & Notification Preferences</span>
          </h3>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Staff Notification Dispatch Email</label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div>
              <span className="font-bold text-neutral-900 block">Auto-Approve Customer Bookings</span>
              <span className="text-neutral-500 text-[11px]">
                Automatically set web bookings to "Confirmed" without manual staff triage.
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoConfirmBookings}
              onChange={(e) => setAutoConfirmBookings(e.target.checked)}
              className="w-5 h-5 rounded text-[#d4af37] accent-[#d4af37] cursor-pointer"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-neutral-900 font-cinzel flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#aa820a]" />
            <span>Public Social Media Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Facebook URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">YouTube URL</label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl btn-gold text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
