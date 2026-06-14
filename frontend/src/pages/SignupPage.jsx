import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Must be at least 8 characters';
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) errs.password = 'Must contain letters and numbers';
    if (!agreed) errs.terms = 'You must agree to the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Registration successful! Please log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Registration failed. Please try again.';
      toast.error(msg);
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Google signup failed');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <section className="hidden md:flex flex-1 relative bg-[var(--color-primary)] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 rounded-full bg-[var(--color-secondary)] blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-[var(--color-secondary-container)] blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 text-center px-12 max-w-lg">
          <h1 className="font-display text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Elevate Your Device Aesthetics.
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Join CoverScart to experience premium craftsmanship and exclusive designs for your everyday essentials.
          </p>
          <div className="mt-12 animate-float">
            <div className="w-48 h-48 mx-auto rounded-3xl shadow-2xl rotate-12 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-secondary-container)] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                smartphone
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col justify-center items-center px-5 py-12 bg-[var(--color-surface)]">
        <div className="w-full max-w-md animate-fade-in">
          <header className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-primary)] uppercase mb-2">
              CoverScart
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Create your account to start shopping</p>
          </header>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="full_name" className="block text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="John Doe"
                className={`w-full h-14 px-4 bg-[var(--color-surface-container-lowest)] border rounded-lg focus:outline-none focus:ring-1 transition-colors text-sm text-[var(--color-on-surface)] ${
                  errors.name ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' : 'border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="signup_email" className="block text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] mb-2">
                Email Address
              </label>
              <input
                id="signup_email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="name@example.com"
                className={`w-full h-14 px-4 bg-[var(--color-surface-container-lowest)] border rounded-lg focus:outline-none focus:ring-1 transition-colors text-sm text-[var(--color-on-surface)] ${
                  errors.email ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' : 'border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="signup_password" className="block text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="signup_password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="••••••••"
                  className={`w-full h-14 px-4 pr-12 bg-[var(--color-surface-container-lowest)] border rounded-lg focus:outline-none focus:ring-1 transition-colors text-sm text-[var(--color-on-surface)] ${
                    errors.password ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]' : 'border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-[var(--color-on-surface-variant)] mt-1 leading-tight">
                Must be at least 8 characters with a mix of letters and numbers.
              </p>
              {errors.password && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password}</p>}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, terms: '' })); }}
                className="mt-0.5 w-5 h-5 rounded border-[var(--color-outline-variant)] text-[var(--color-secondary)] focus:ring-[var(--color-secondary)] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-[var(--color-on-surface-variant)] leading-tight cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-[var(--color-primary)] font-semibold underline underline-offset-2">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-[var(--color-primary)] font-semibold underline underline-offset-2">Privacy Policy</a>.
              </label>
            </div>
            {errors.terms && <p className="text-xs text-[var(--color-error)] -mt-3">{errors.terms}</p>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-semibold text-base rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex items-center my-6 gap-4">
            <div className="h-px flex-1 bg-[var(--color-outline-variant)]/30" />
            <span className="text-xs font-semibold text-[var(--color-outline)] tracking-widest uppercase">Or signup with</span>
            <div className="h-px flex-1 bg-[var(--color-outline-variant)]/30" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="h-14 flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] rounded-lg font-semibold text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => toast('Apple Sign In requires native integration.', { icon: '🍎' })}
              className="h-14 flex items-center justify-center gap-2 border border-[var(--color-outline-variant)] rounded-lg font-semibold text-sm text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] transition-colors active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 814 1000" aria-hidden="true" fill="currentColor">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-142.9-93.8c-43.6-63.4-78.6-154.7-78.6-241.3 0-140.9 91.5-215.4 181.1-215.4 46.5 0 85.5 30.5 115 30.5s76.2-32.1 128.8-32.1c20.1 0 88.6 1.9 135.3 66.1zm-158.6-234.4c25.9-30.8 44.9-73.5 44.9-116.2 0-5.8-.6-11.6-1.9-16.1-43 1.6-93.5 28.4-124.2 61.9-23.2 25.2-46.4 68.5-46.4 111.8 0 6.4 1.3 12.8 1.9 14.7 2.6.5 6.5.9 10.5.9 38.6 0 87.1-25.6 115.2-56.9"/>
              </svg>
              Apple
            </button>
          </div>

          <footer className="mt-12 text-center">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-secondary)] font-semibold hover:underline underline-offset-4 transition-all ml-1">
                Back to Login
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
