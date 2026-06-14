import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    // Simulate auth reset trigger
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Password reset link sent! Check your inbox 📬');
    setLoading(false);
    navigate('/login');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-6 bg-[var(--color-background)]">
      <div className="w-full max-w-md bg-[var(--color-surface-container-lowest)] p-8 rounded-xl shadow-sm border border-[var(--color-outline-variant)]/10">
        <h2 className="text-2xl font-bold font-display text-center mb-2">Reset Password</h2>
        <p className="text-xs text-[var(--color-on-surface-variant)] text-center mb-8">
          Enter your registered email below, and we will email you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-[var(--color-on-surface-variant)] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-[var(--color-outline-variant)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded-lg py-3 px-4 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-lg font-bold text-sm tracking-wide mt-4 active:scale-95 transition-transform"
          >
            {loading ? 'Sending link…' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--color-outline-variant)]/20 text-center">
          <Link to="/login" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
