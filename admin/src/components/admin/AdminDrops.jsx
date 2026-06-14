import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminDrops() {
  const [drops, setDrops] = useState([
    { id: 'drop-1', name: 'Cyberpunk Neon Launch', date: '2026-07-01', end: '2026-07-07', countdown: '18d 06h', quantity: 200, badge: 'Cyber Collector', revenue: 42500, conversion: '4.8%', waitlist: 840, status: 'Upcoming' },
    { id: 'drop-2', name: 'Matte Leather Signature Edition', date: '2026-06-10', end: '2026-06-13', countdown: 'Ended', quantity: 50, badge: 'Gold VIP', revenue: 95000, conversion: '8.2%', waitlist: 120, status: 'Ended' },
    { id: 'drop-3', name: 'Demon Slayer Giyu Drop', date: '2026-06-12', end: '2026-06-15', countdown: '02d 14h', quantity: 100, badge: 'Anime Otaku', revenue: 8990, conversion: '5.1%', waitlist: 340, status: 'Active' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', end: '', quantity: 100, badge: '', status: 'Upcoming' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDrop = {
      id: `drop-${Date.now()}`,
      ...form,
      countdown: 'Upcoming',
      revenue: 0,
      conversion: '0%',
      waitlist: 0
    };
    setDrops(prev => [newDrop, ...prev]);
    toast.success('New Limited Drop launched!');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Limited Edition drops</h1>
          <p className="text-xs text-zinc-500 font-medium">Schedule premium custom cases drops, customize countdown triggers, collector badges, and analytics.</p>
        </div>
        <button onClick={() => { setForm({ name: '', date: '', end: '', quantity: 100, badge: 'Standard Collector', status: 'Upcoming' }); setShowModal(true); }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Launch New Drop
        </button>
      </div>

      {/* Drops dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active drops', val: drops.filter(d => d.status === 'Active').length },
          { label: 'Total drops Revenue', val: '₹1,46,490', color: 'text-emerald-600' },
          { label: 'Total Waitlisted Leads', val: '1,300 leads' },
          { label: 'Average Drop Conversion', val: '6.03%' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-zinc-150 shadow-xs">
            <div className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-1">{card.label}</div>
            <div className={`text-lg font-display font-bold text-black ${card.color || ''}`}>{card.val}</div>
          </div>
        ))}
      </div>

      {/* Drops grid */}
      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Drop Name</th>
              <th className="p-4">Badge Reward</th>
              <th className="p-4">Start/End Date</th>
              <th className="p-4 text-center">Countdown</th>
              <th className="p-4 text-center">Release Qty</th>
              <th className="p-4 text-center">Waitlist</th>
              <th className="p-4 text-right">Revenue</th>
              <th className="p-4 text-right">Conversion</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {drops.map((d) => (
              <tr key={d.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-bold text-black">{d.name}</td>
                <td className="p-4">
                  <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                    🏆 {d.badge}
                  </span>
                </td>
                <td className="p-4 text-[10px] text-zinc-500 font-semibold">{d.date} to {d.end}</td>
                <td className="p-4 text-center font-mono font-bold text-zinc-700">{d.countdown}</td>
                <td className="p-4 text-center font-bold text-black">{d.quantity}</td>
                <td className="p-4 text-center text-zinc-500 font-semibold">{d.waitlist} users</td>
                <td className="p-4 text-right font-bold text-black">₹{d.revenue.toLocaleString()}</td>
                <td className="p-4 text-right text-emerald-600 font-bold">{d.conversion}</td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${d.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : d.status === 'Upcoming' ? 'bg-blue-100 text-blue-950' : 'bg-zinc-150 text-zinc-600'}`}>
                    {d.status}
                  </span>
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
              <h2 className="font-display font-extrabold text-sm text-black">Launch Limited Drop</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Drop Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Total Quantity</label>
                  <input 
                    type="number" 
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Collector Badge Label</label>
                  <input 
                    type="text" 
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Initial Status</label>
                <select 
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                >
                  <option value="Upcoming">Upcoming (Schedule countdown)</option>
                  <option value="Active">Active (Launch instantly)</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Launch Drop</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
