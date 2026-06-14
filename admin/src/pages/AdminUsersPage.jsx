import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/auth/users'); // Custom route to fetch users list
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
        // Fallback mock users if route is not implemented
        setUsers([
          { id: '1', email: 'admin@coverscart.com', name: 'Store Owner', role: 'admin' },
          { id: '2', email: 'ramesh@example.com', name: 'Ramesh Patel', role: 'user' },
          { id: '3', email: 'john@example.com', name: 'John Doe', role: 'user' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/10">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-primary)]">Admin Accounts</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">View all registered storefront customer accounts.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="text-sm text-[var(--color-secondary)] hover:underline font-semibold cursor-pointer">
            Back to Dashboard
          </button>
        </header>

        <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[var(--color-outline)] animate-pulse">Loading system users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]/30 text-xs font-bold text-[var(--color-outline)]">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Account Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]/20 text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--color-surface-container-low)]">
                      <td className="p-4 font-mono text-xs">{u.id}</td>
                      <td className="p-4 font-semibold">{u.name || 'Anonymous'}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4 font-bold uppercase tracking-wider text-xs">
                        <span className={`px-2 py-0.5 rounded ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
