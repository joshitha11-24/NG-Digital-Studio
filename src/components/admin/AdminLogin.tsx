import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Eye, EyeOff, ArrowLeft, User } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

interface AdminLoginProps {
  onBackToPublic?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublic }) => {
  const { login } = useAdmin();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password, rememberMe, {
        name: name.trim()
      });
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid email or password');
      }
    }, 400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#08080b] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans-clean">
      
      {/* Premium Studio Ambient Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a2210]/30 via-[#0b0b0e] to-[#050507] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#aa771c]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Top Logo & Branding */}
        <div className="text-center mb-6 space-y-2">
          {onBackToPublic && (
            <div className="flex justify-start mb-2">
              <button
                type="button"
                onClick={onBackToPublic}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#d4af37] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Public Website</span>
              </button>
            </div>
          )}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2a2215] to-[#121218] border border-[#d4af37]/50 shadow-[0_0_25px_rgba(212,175,55,0.2)] mb-2 overflow-hidden">
            <img
              src="/images of studio/123232.jpg"
              alt="NG Digital Studio Logo"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-extrabold tracking-[0.15em] text-white uppercase">
            NG DIGITAL STUDIO
          </h2>
          <div className="inline-block px-3 py-0.5 rounded-full bg-[#181822] border border-[#d4af37]/30 text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
            Management Portal
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-[#101017]/90 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,55,0.08)] space-y-6">
          
          <div className="space-y-1 border-b border-neutral-800/80 pb-4">
            <h1 className="font-cinzel text-2xl font-bold text-white tracking-wide">
              Admin Login
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in with your director profile to manage your studio, bookings, and clients.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 flex items-start gap-3 text-xs text-red-200 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Admin Name Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-300">
                Admin / Director Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Joshitha Srinivasan)"
                  className="w-full bg-[#09090d] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
                />
              </div>
            </div>

            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-300">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ngstudio.com or username"
                  className="w-full bg-[#09090d] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-[#d4af37] hover:text-[#f3e5ab] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#09090d] border border-neutral-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#09090d] border-neutral-700 text-[#d4af37] focus:ring-0 focus:ring-offset-0 accent-[#d4af37]"
                />
                <span className="text-xs text-neutral-300">Remember Me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl btn-gold text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] disabled:opacity-60 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login to Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Bottom studio security disclaimer */}
        <p className="text-center text-[11px] text-neutral-500 mt-6">
          Authorized personnel and studio directors only. All activities are logged.
        </p>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12121a] border border-[#d4af37]/40 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold text-white">
              Reset Admin Password
            </h3>
            <p className="text-xs text-neutral-400">
              Enter your registered studio email to receive password recovery instructions.
            </p>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-green-950/40 border border-green-800 text-xs text-green-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>Password reset link sent to {forgotEmail || 'your email'}!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@ngstudio.com"
                    className="w-full bg-[#08080c] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg btn-gold text-xs font-bold"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
