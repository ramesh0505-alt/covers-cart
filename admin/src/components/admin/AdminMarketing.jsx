import { useState } from 'react';
import toast from 'react-hot-toast';

export function AdminMarketing() {
  const [automations, setAutomations] = useState([
    { id: 'auto-1', event: 'Abandoned Checkout Cart', delay: '30 mins', action: 'Send 10% Discount Code via SMS', status: 'Active' },
    { id: 'auto-2', event: 'First Purchase Completed', delay: 'Instant', action: 'Send Welcome Loyalty Points via Email', status: 'Active' },
    { id: 'auto-3', event: 'Custom Design Upload Pending', delay: '24 hours', action: 'Send Designer Reminder Push Notification', status: 'Paused' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ event: 'Abandoned Checkout Cart', delay: '30 mins', action: '' });

  const handleCreateAutomation = (e) => {
    e.preventDefault();
    setAutomations(prev => [...prev, { id: `auto-${Date.now()}`, ...form, status: 'Active' }]);
    toast.success('Marketing automation rule registered!');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Marketing Automations & CRM Campaigns</h1>
          <p className="text-xs text-zinc-500 font-medium">Create automated push, email and SMS triggers for cart recoveries, review requests, and mystery rewards notifications.</p>
        </div>
        <button onClick={() => { setForm({ event: 'Abandoned Checkout Cart', delay: '15 mins', action: '' }); setShowModal(true); }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Add Automation Rule
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Customer Event Trigger</th>
              <th className="p-4">Delay Offset</th>
              <th className="p-4">Action Pipeline</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {automations.map((a) => (
              <tr key={a.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-bold text-black">{a.event}</td>
                <td className="p-4 font-mono font-semibold text-zinc-500">{a.delay}</td>
                <td className="p-4 text-indigo-650 font-semibold">{a.action}</td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : 'bg-zinc-150 text-zinc-650'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => {
                      setAutomations(prev => prev.map(item => item.id === a.id ? { ...item, status: item.status === 'Active' ? 'Paused' : 'Active' } : item));
                      toast.success('Rule status toggled!');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-zinc-150 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h2 className="font-display font-extrabold text-sm text-black">Create Automation Trigger</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateAutomation} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Trigger Event</label>
                <select 
                  value={form.event}
                  onChange={(e) => setForm({ ...form, event: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                >
                  <option value="Abandoned Checkout Cart">Abandoned Checkout Cart</option>
                  <option value="First Purchase Completed">First Purchase Completed</option>
                  <option value="Review Submitted">Review Submitted</option>
                  <option value="Mystery Box Unboxed">Mystery Box Unboxed</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Delay Offset</label>
                <input 
                  type="text" 
                  value={form.delay}
                  onChange={(e) => setForm({ ...form, delay: e.target.value })}
                  placeholder="e.g. 30 mins, 2 hours"
                  className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Action Pipeline</label>
                <input 
                  type="text" 
                  value={form.action}
                  onChange={(e) => setForm({ ...form, action: e.target.value })}
                  placeholder="e.g. Send 15% recovery email coupon"
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Deploy Automation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const getToken = () => localStorage.getItem('admin_portal_token') || localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/enterprise/analytics-dashboard', { headers: { Authorization: `Bearer ${getToken()}` }})
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Enterprise Analytics Center</h1>
        <p className="text-xs text-zinc-500 font-medium">Audit sales trends, profit margins per cover category, customer lifetime value distributions, and mystery pools payouts.</p>
      </div>

      {!stats ? (
        <div className="p-8 text-center text-zinc-500">Loading Enterprise Analytics...</div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Margin analytics */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-[11px] uppercase tracking-wider text-zinc-450">Category Margins Audit</h3>
          <div className="space-y-3">
            {[
              { category: 'Premium Covers', cost: '₹350', price: '₹999', margin: '65%' },
              { category: 'Leather Covers', cost: '₹750', price: '₹1,899', margin: '60%' },
              { category: 'Anime licensed Covers', cost: '₹280', price: '₹899', margin: '68%' },
              { category: 'Mystery pouches', cost: '₹180', price: '₹599', margin: '70%' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <div>
                  <div className="font-bold text-zinc-800">{item.category}</div>
                  <div className="text-[10px] text-zinc-400">Avg Cost: {item.cost} | MSRP: {item.price}</div>
                </div>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">{item.margin} Margin</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product matrices */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-[11px] uppercase tracking-wider text-zinc-450">Best vs Worst Sellers</h3>
          <div className="space-y-3">
            <div>
              <div className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Top Performing Cover SKU</div>
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center text-indigo-950 font-bold">
                <span>CS-NEON-01 (Cyberpunk Case)</span>
                <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">120 sold</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Lowest Performing Cover SKU</div>
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-xl flex justify-between items-center text-red-950 font-bold">
                <span>CS-LTHR-02 (Leather Wallet Case)</span>
                <span className="bg-white px-2 py-0.5 rounded border border-red-200">45 sold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mystery box payouts distribution */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-[11px] uppercase tracking-wider text-zinc-450">Mystery Box Odds Payouts</h3>
          <div className="space-y-3">
            {[
              { tier: 'Basic Pouch', prob: '45%', count: '312 unboxed' },
              { tier: 'Premium Pouch', prob: '30%', count: '204 unboxed' },
              { tier: 'Rare Pouch', prob: '15%', count: '94 unboxed' },
              { tier: 'Anime & Creator Specialty', prob: '10%', count: '170 unboxed' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <span className="font-bold text-zinc-700">{item.tier}</span>
                <div className="text-right">
                  <div className="font-bold text-black">{item.prob} odds</div>
                  <div className="text-[9px] text-zinc-400 font-semibold">{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      )}
    </div>
  );
}
