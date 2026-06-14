import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForbiddenPage() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fbf8fc] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        <div className="mx-auto h-14 w-14 bg-red-50 text-red-600 flex items-center justify-center rounded-xl mb-4">
          <ShieldX size={28} />
        </div>
        <h1 className="text-2xl font-extrabold text-[#4c4546]">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-500">
          {user?.email
            ? `Account ${user.email} does not have admin portal permissions.`
            : 'You do not have permission to access the admin portal.'}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => logout().then(() => { window.location.href = '/login'; })}
            className="w-full py-3 rounded-lg bg-[#4648d4] text-white text-sm font-semibold hover:bg-opacity-90"
          >
            Sign out & return to login
          </button>
          <Link to="/login" className="text-sm text-gray-500 hover:text-[#4648d4]">
            Back to admin login
          </Link>
        </div>
      </div>
    </div>
  );
}
