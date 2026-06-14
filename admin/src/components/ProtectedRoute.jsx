import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdminPortalRole, normalizeRole } from '../constants/roles';
import ForbiddenPage from '../pages/ForbiddenPage';

/**
 * Protects admin portal routes — requires JWT session and admin portal role.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, role, loading, hasPortalAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf8fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4648d4] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Validating session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPortalAccess && !isAdminPortalRole(normalizeRole(role))) {
    return <ForbiddenPage />;
  }

  return children;
}
