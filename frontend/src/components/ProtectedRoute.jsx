import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Blocks unauthenticated users and enforces role-based access.
 */
export default function ProtectedRoute({ children, allowedRoles = [], adminOnly = false }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="flex flex-col items-center gap-4">
          <span
            className="material-symbols-outlined text-5xl text-[var(--color-secondary)]"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            progress_activity
          </span>
          <p className="text-sm text-[var(--color-on-surface-variant)]">Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle legacy adminOnly property
  const rolesToCheck = [...allowedRoles];
  if (adminOnly && !rolesToCheck.includes('admin')) {
    rolesToCheck.push('admin');
  }

  if (rolesToCheck.length > 0 && !rolesToCheck.map(r => r.toLowerCase()).includes(role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}
