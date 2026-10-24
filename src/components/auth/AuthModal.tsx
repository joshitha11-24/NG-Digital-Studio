import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  AlertCircle,
  RefreshCw,
  Send,
  KeyRound
} from 'lucide-react';
import { UserAccount } from '../../types';
import { firebaseAuthService } from '../../services/firebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
  bookingNotice?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
  bookingNotice = true,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);

  if (!isOpen) return null;

  const getFirebaseErrorMessage = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address. Please switch to Sign In.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please verify your credentials or reset your password.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email format (e.g. name@example.com).';
      case 'auth/too-many-requests':
        return 'Access temporarily blocked due to repeated failed attempts. Please reset password or try again shortly.';
      case 'auth/network-request-failed':
        return 'Network connection issue. Please check your internet connection.';
      default:
        return err?.message || 'Authentication error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your registered email address.');
        return;
      }
      setLoading(true);
      try {
        await firebaseAuthService.sendPasswordReset(email.trim());
        setSuccessMsg(`Password reset instructions have been dispatched to ${email.trim()}.`);
      } catch (err: any) {
        setError(getFirebaseErrorMessage(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) {
      setError('Please provide both your email and password.');
      return;
    }

    if (mode === 'register' && (!name.trim() || !phone.trim())) {
      setError('Please provide your full name and phone number for studio booking records.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const { user, profile, verificationSent } = await firebaseAuthService.registerCustomer(
          name.trim(),
          phone.trim(),
          email.trim(),
          password
        );

        const account: UserAccount = {
          uid: user.uid,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          isLoggedIn: true,
          emailVerified: user.emailVerified,
          role: profile.role
        };

        localStorage.setItem('ng_studio_user', JSON.stringify(account));
        if (verificationSent) {
          setVerificationPending(true);
        }

        onSuccess(account);
        setSuccessMsg('Account created successfully! Verification email dispatched.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Mode === 'login'
        const { user, profile } = await firebaseAuthService.login(email.trim(), password);

        const account: UserAccount = {
          uid: user.uid,
          name: profile?.name || user.displayName || email.split('@')[0],
          email: user.email || email.trim(),
          phone: profile?.phone || '',
          isLoggedIn: true,
          emailVerified: user.emailVerified,
          role: profile?.role || 'customer'
        };

        localStorage.setItem('ng_studio_user', JSON.stringify(account));
        onSuccess(account);
        onClose();
      }
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setResendingVerification(true);
      await firebaseAuthService.resendVerificationEmail();
      setSuccessMsg('A fresh verification link has been resent to your inbox.');
    } catch (err: any) {
      setError('Could not resend verification email: ' + err.message);
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-md bg-[#111116] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden"
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a]" />

        {/* Close Button */}
        <button
          id="auth-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            {mode === 'forgot' ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Studio Account' : 'Reset Password'}
          </h3>

          <p className="text-xs text-neutral-400 mt-1 font-sans-clean">
            {mode === 'forgot'
              ? 'Enter your email to receive a password reset link.'
              : bookingNotice 
                ? 'Sign in or register to secure your booking dates and customized package.' 
                : 'Access your saved quotes, favorites, and studio bookings.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="flex rounded-xl bg-[#09090c] p-1 border border-neutral-800 mb-6">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login' 
                  ? 'bg-[#d4af37] text-black shadow-md' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register' 
                  ? 'bg-[#d4af37] text-black shadow-md' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Email Verification Alert Banner */}
        {verificationPending && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Mail className="w-4 h-4" />
              <span>Email Verification Sent</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              A confirmation link has been sent to your email. You can verify it anytime in your inbox.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-semibold pt-1"
            >
              {resendingVerification ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Resend Verification Link</span>
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Full Name / Couple Names *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anand & Meera"
                    className="w-full bg-[#09090c] border border-neutral-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Phone Number (WhatsApp Active) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full bg-[#09090c] border border-neutral-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-input-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-[#09090c] border border-neutral-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-neutral-300">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                    className="text-[11px] text-[#d4af37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-input-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#09090c] border border-neutral-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-gold flex items-center justify-center gap-2 text-sm font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' 
                    ? 'Sign In to Studio Account' 
                    : mode === 'register' 
                      ? 'Register & Send Verification' 
                      : 'Send Password Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Return to Sign In
            </button>
          </div>
        )}

        {/* Security badge */}
        <p className="text-[10px] text-center text-neutral-500 mt-4">
          Integrated with Firebase Security & Cloud Firestore Encryption.
        </p>
      </div>
    </div>
  );
};
