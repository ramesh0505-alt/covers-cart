/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import toast from 'react-hot-toast';

export default function AdminCRM() {
  const { customerActions } = useAdminData();
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState(null);
  const [pointsAward, setPointsAward] = useState(100);

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async (pageToFetch) => {
    try {
      const res = await fetch(`/api/users?page=${pageToFetch}&limit=50`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_portal_token') || localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      const data = json.data || json;
      const meta = json.meta || { totalPages: 1 };
      
      setCustomers(data);
      setTotalPages(meta.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Customer Relationship Management (CRM)</h1>
        <p className="text-xs text-zinc-500 font-medium">Analyze client profiles, lifetime value metrics, grant loyalty bonus points, and manage account authorization rules.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-150 flex gap-4 items-center shadow-xs">
        <input 
          type="text" 
          placeholder="Search by customer name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customer Listing */}
        <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs lg:col-span-2">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Tier Status</th>
                <th className="p-4 text-center">Reward Points</th>
                <th className="p-4 text-right">Lifetime Spend</th>
                <th className="p-4 text-center">Fulfillments</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers
                .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
                .map((c) => (
                  <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="p-4">
                      <div className="font-bold text-black">{c.name}</div>
                      <div className="text-[10px] text-zinc-400 font-normal">{c.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${c.tier === 'Elite' ? 'bg-amber-100 text-amber-900 border border-amber-300' : c.tier === 'Gold' ? 'bg-yellow-50 text-yellow-800' : c.tier === 'Silver' ? 'bg-zinc-100 text-zinc-800' : 'bg-orange-50 text-orange-800'}`}>
                        {c.tier} Tier
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-indigo-600">{c.points} pts</td>
                    <td className="p-4 text-right font-bold text-black">₹{c.spend.toLocaleString()}</td>
                    <td className="p-4 text-center text-zinc-500 font-semibold">{c.ordersCount} orders</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : 'bg-red-100 text-red-950'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => setSelectedCust(c)} className="text-[11px] bg-zinc-100 hover:bg-zinc-200 text-black px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer">
                        Workspace
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && !loading && (
            <div className="p-8 text-center text-zinc-500">No customers found.</div>
          )}
          {loading && (
            <div className="p-8 text-center text-zinc-500">Loading customers...</div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-xs lg:col-span-2">
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

        {/* Selected Customer profile detail panel */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Customer Details & Actions</h3>
          {selectedCust ? (
            <div className="space-y-4 text-xs">
              <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-150 space-y-1">
                <div className="font-bold text-black text-sm">{selectedCust.name}</div>
                <div className="text-[10px] text-zinc-400 font-semibold">{selectedCust.email}</div>
                <div className="text-[10px] text-zinc-400 font-semibold">{selectedCust.phone}</div>
                <div className="text-[10px] text-zinc-500 font-medium mt-1 leading-relaxed"><span className="font-bold">Shipping address:</span> {selectedCust.address}</div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-zinc-500 uppercase text-[9px] tracking-wide">Internal Notes</div>
                <div className="p-2.5 bg-yellow-50/50 border border-yellow-100 rounded-lg text-yellow-950 italic text-[11px]">
                  "{selectedCust.notes || 'No notes available'}"
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 space-y-2">
                <div className="font-bold text-zinc-500 uppercase text-[9px]">Adjust Loyalty Points</div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={pointsAward}
                    onChange={(e) => setPointsAward(Number(e.target.value))}
                    className="w-20 bg-white border border-zinc-200 px-2.5 py-1.5 rounded-lg font-bold text-center"
                  />
                  <button 
                    onClick={() => {
                      customerActions.grantPoints(selectedCust.id, pointsAward);
                      toast.success(`Awarded ${pointsAward} points!`);
                      setSelectedCust(prev => ({ ...prev, points: prev.points + pointsAward }));
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-lg active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Grant points
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    customerActions.suspend(selectedCust.id);
                    toast.success(selectedCust.status === 'Active' ? 'Account suspended!' : 'Account reactivated!');
                    setSelectedCust(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
                  }}
                  className={`flex-1 py-2 rounded-xl text-center font-bold text-[11px] active:scale-95 transition-all cursor-pointer border ${selectedCust.status === 'Active' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                >
                  {selectedCust.status === 'Active' ? 'Suspend Account' : 'Reactivate'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-400 text-xs">
              Select a customer to view logs, notes, and trigger points/administrative actions.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
