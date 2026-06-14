import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, hasPortalAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && hasPortalAccess) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, hasPortalAccess, location.state, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome to Admin Portal');
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf8fc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#4648d4] text-white flex items-center justify-center rounded-xl mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-[#4c4546]">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-500">
            Secure access for authorized personnel only
          </p>
          <p className="mt-1 text-xs text-gray-400">admin.coverscart.com</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#4648d4] focus:border-[#4648d4] sm:text-sm mt-1"
                placeholder="admin@coverscart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-[#4648d4] focus:border-[#4648d4] sm:text-sm mt-1"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4648d4] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4648d4] disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Secure Login'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Customer accounts cannot access this portal.
        </p>
      </div>
    </div>
  );
}
