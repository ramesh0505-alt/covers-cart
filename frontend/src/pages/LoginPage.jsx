import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, googleLogin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [errors,       setErrors]       = useState({});

  if (!authLoading && isAuthenticated) return <Navigate to={from} replace />;

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Google login failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-6 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--color-secondary-fixed)]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-[var(--color-surface-container-highest)]/50 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-[var(--color-surface-container-lowest)] p-8 md:p-12 rounded-xl shadow-sm border border-[var(--color-outline-variant)]/10 z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              smartphone
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-primary)]">
            CoverScart
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm mt-2 text-center">
            Secure your style. Premium protection for your daily carry.
          </p>
        </div>

        {errors.form && (
          <div className="mb-4 p-3 rounded-lg bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 text-xl">
                mail
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                placeholder="name@example.com"
                className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-1 transition-all placeholder:text-[var(--color-outline-variant)]/70 ${
                  errors.email
                    ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
                    : 'border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label htmlFor="password" className="text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)]">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-[var(--color-secondary)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 text-xl">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 bg-white border rounded-lg text-sm text-[var(--color-on-surface)] focus:outline-none focus:ring-1 transition-all placeholder:text-[var(--color-outline-variant)]/70 ${
                  errors.password
                    ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
                    : 'border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Toggle password visibility"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-base py-4 rounded-lg mt-2 active:scale-[0.98] transition-all shadow-md hover:bg-neutral-800 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                Authenticating…
              </>
            ) : (
              <>
                Login
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="flex items-center my-6 gap-4">
          <div className="h-px flex-1 bg-[var(--color-outline-variant)]/30" />
          <span className="text-xs font-semibold text-[var(--color-outline)] tracking-widest uppercase">Or login with</span>
          <div className="h-px flex-1 bg-[var(--color-outline-variant)]/30" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-14 flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] rounded-lg font-semibold text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div className="mt-8 pt-6 border-t border-[var(--color-outline-variant)]/20 text-center">
          <p className="text-[var(--color-on-surface-variant)] text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--color-primary)] font-semibold hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
