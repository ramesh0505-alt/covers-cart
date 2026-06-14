import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders'); // Admin fetches all orders
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load system orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/10">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-primary)]">Admin Orders Queue</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Track and manage customer checkout orders.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="text-sm text-[var(--color-secondary)] hover:underline font-semibold cursor-pointer">
            Back to Dashboard
          </button>
        </header>

        <div className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-[var(--color-outline)] animate-pulse">Loading orders queue...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-sm text-[var(--color-outline)]">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]/30 text-xs font-bold text-[var(--color-outline)]">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer ID</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4">Date Placed</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]/20 text-sm">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[var(--color-surface-container-low)]">
                      <td className="p-4 font-mono text-xs">{o.id}</td>
                      <td className="p-4 text-xs font-mono">{o.userId}</td>
                      <td className="p-4 font-bold">₹{o.total?.toFixed(2) || '0.00'}</td>
                      <td className="p-4 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          o.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {o.status?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={o.status || 'pending'} 
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="border border-[#cfc4c5] rounded p-1 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
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
