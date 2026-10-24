import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const { login, loading, error, clearError } = useAdminAuth();
  const [email, setEmail] = useState('ng.digitalstudiomdu@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }
    await login(email.trim(), password.trim());
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0b0e] text-[#f4f4f6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background studio lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#997d26]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Back to Customer Website */}
        <div className="flex items-center justify-start mb-4">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customer Website</span>
          </a>
        </div>

        {/* Card Header & Studio Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#997d26] p-0.5 shadow-2xl shadow-[#d4af37]/20 mb-4">
            <div className="w-full h-full bg-[#121217] rounded-[14px] flex items-center justify-center overflow-hidden">
              <img
                src="/images of studio/123232.jpg"
                alt="NG Digital Studio Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white font-['Cinzel',serif] tracking-wider">
            NG DIGITAL STUDIO
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Dedicated Admin Portal
          </p>
          <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto">
            Authorized studio administration access for bookings, customers, packages & galleries.
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#121217] border border-[#262633] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
          <div className="mb-6 pb-4 border-b border-[#20202a]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Administrator Sign In</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Secure Studio Administration Portal</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Authentication Notice</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="admin@ngdigitalstudio.com"
                  required
                  className="w-full bg-[#181822] border border-[#2c2c3d] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#181822] border border-[#2c2c3d] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-white text-xs rounded-xl pl-10 pr-10 py-3 outline-none transition-all placeholder:text-neutral-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#d4af37] hover:brightness-110 active:scale-[0.99] text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/25 transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Studio Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6 text-[11px] text-neutral-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Restricted Portal • SSL Encrypted • Session Monitored</span>
        </div>
      </div>
    </div>
  );
};
