/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminWhatsAppOrders({ orderActions }) {
  const [search, setSearch] = useState('');
  const [whatsappOrders, setWhatsappOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (pageToFetch) => {
    try {
      const res = await fetch(`/api/orders/all?page=${pageToFetch}&limit=50`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_portal_token') || localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      const data = json.data || json;
      const meta = json.meta || { totalPages: 1 };
      
      const whOrders = data.filter(o => o.paymentMethod === 'WHATSAPP');
      setWhatsappOrders(whOrders);
      setTotalPages(meta.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch WhatsApp orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleStatusChange = async (id, statusData) => {
    try {
      await orderActions.edit(id, statusData);
      toast.success('Order status updated successfully!');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">WhatsApp Orders Verification</h1>
          <p className="text-xs text-zinc-500 font-medium">Manage and verify manual payments received via WhatsApp / UPI.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-150 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex-1 max-w-sm">
          <input 
            type="text" 
            placeholder="Search WhatsApp orders by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer Info</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4 text-center">Payment Status</th>
              <th className="p-4 text-center">Order Status</th>
              <th className="p-4 text-center">Screenshot</th>
              <th className="p-4 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {whatsappOrders
              .filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || (o.customerName && o.customerName.toLowerCase().includes(search.toLowerCase())))
              .map(o => (
              <tr key={o.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-mono font-bold text-black">{o.id}</td>
                <td className="p-4">
                  <div className="font-semibold text-black">{o.customerName || 'N/A'}</div>
                  <div className="text-[10px] text-zinc-400">{o.email || o.shippingAddress?.substring(0,20) + '...'}</div>
                </td>
                <td className="p-4 font-bold text-black">₹{o.totalAmount || o.total || 0}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' 
                    : o.paymentStatus === 'Pending Payment' ? 'bg-amber-100 text-amber-800' 
                    : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {o.paymentStatus || 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ['Shipped', 'Delivered'].includes(o.status) ? 'bg-indigo-100 text-indigo-800' 
                    : o.status === 'Cancelled' ? 'bg-red-100 text-red-800'
                    : 'bg-zinc-100 text-zinc-800'
                  }`}>
                    {o.status || 'PENDING'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {/* Simulated Uploaded Screenshot Status */}
                  <span className="text-[10px] text-zinc-400 italic">Via WhatsApp</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <select 
                    className="text-[10px] border border-zinc-200 rounded px-2 py-1 cursor-pointer bg-white"
                    onChange={(e) => {
                      if (e.target.value) {
                        const val = e.target.value.split('|');
                        handleStatusChange(o.id, { paymentStatus: val[0], status: val[1] });
                        e.target.value = "";
                      }
                    }}
                  >
                    <option value="">Quick Action...</option>
                    <option value="PAID|Confirmed">Approve Payment</option>
                    <option value="Failed|Cancelled">Reject Payment</option>
                    <option value="PAID|Processing">Mark Processing</option>
                    <option value="PAID|Shipped">Mark Shipped</option>
                    <option value="PAID|Delivered">Mark Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {whatsappOrders.length === 0 && !loading && (
          <div className="p-8 text-center text-zinc-500">No WhatsApp orders found on this page.</div>
        )}
        {loading && (
          <div className="p-8 text-center text-zinc-500">Loading orders...</div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs">
        <button 
          onClick={() => { setLoading(true); setPage(p => Math.max(1, p - 1)); }} 
          disabled={page === 1}
          className="px-3 py-1.5 border border-zinc-200 bg-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages || 1}</span>
        <button 
          onClick={() => { setLoading(true); setPage(p => Math.min(totalPages, p + 1)); }} 
          disabled={page >= totalPages}
          className="px-3 py-1.5 border border-zinc-200 bg-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
