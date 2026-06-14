import { useState } from 'react';
import toast from 'react-hot-toast';

export function AdminShipping() {
  const [zones, setZones] = useState([
    { id: 'zone-1', name: 'Domestic Premium Metro', rate: 99, courier: 'Delhivery Air', rules: 'Cart < ₹799 (Else Free)' },
    { id: 'zone-2', name: 'Standard India Tier 2/3', rate: 49, courier: 'BlueDart Surface', rules: 'Flat Rate' },
    { id: 'zone-3', name: 'International Premium Express', rate: 1499, courier: 'DHL Express', rules: 'Weight <= 0.5kg' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', rate: 0, courier: 'Delhivery Air', rules: '' });

  const handleCreateZone = (e) => {
    e.preventDefault();
    setZones(prev => [...prev, { id: `z-${Date.now()}`, ...form }]);
    toast.success('Shipping zone created!');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Shipping Zones & Courier APIs</h1>
          <p className="text-xs text-zinc-500 font-medium">Configure domestic metro regions, flat delivery rates, and active logistics channels.</p>
        </div>
        <button onClick={() => { setForm({ name: '', rate: 49, courier: 'Delhivery Air', rules: 'Flat Rate' }); setShowModal(true); }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Add Shipping Zone
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Shipping Zone</th>
              <th className="p-4">Primary Courier Partner</th>
              <th className="p-4">Delivery Rules</th>
              <th className="p-4 text-right">Standard Rate</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z) => (
              <tr key={z.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-bold text-black">{z.name}</td>
                <td className="p-4 font-semibold text-indigo-600">{z.courier}</td>
                <td className="p-4 text-zinc-500 font-semibold">{z.rules}</td>
                <td className="p-4 text-right font-bold text-black">₹{z.rate}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => { setZones(prev => prev.filter(item => item.id !== z.id)); toast.success('Zone deleted!'); }} className="text-xs font-bold text-red-650 hover:underline cursor-pointer">Delete</button>
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
              <h2 className="font-display font-extrabold text-sm text-black">Add Shipping Zone</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateZone} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Zone Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Courier Partner</label>
                <select 
                  value={form.courier}
                  onChange={(e) => setForm({ ...form, courier: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                >
                  <option value="Delhivery Air">Delhivery Air</option>
                  <option value="BlueDart Surface">BlueDart Surface</option>
                  <option value="DHL Express">DHL Express</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Standard Rate (INR)</label>
                  <input 
                    type="number" 
                    value={form.rate}
                    onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Trigger Condition</label>
                  <input 
                    type="text" 
                    value={form.rules}
                    onChange={(e) => setForm({ ...form, rules: e.target.value })}
                    placeholder="e.g. Weight <= 0.5kg"
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Create Zone</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminPayments() {
  const [gateways, setGateways] = useState([
    { name: 'Razorpay Payment Gateway', type: 'UPI, Cards, Netbanking', status: 'Live Connected', split: '65%' },
    { name: 'Stripe Corporate Payouts', type: 'International Credit Cards', status: 'Live Connected', split: '30%' },
    { name: 'COD / Cash On Delivery Broker', type: 'Manual Cash Ledger', status: 'Inactive', split: '5%' }
  ]);

  const handleToggleStatus = (name) => {
    setGateways(prev => prev.map(g => {
      if (g.name === name) {
        const nextStatus = g.status === 'Live Connected' ? 'Inactive' : 'Live Connected';
        toast.success(`${g.name} status set to ${nextStatus}`);
        return { ...g, status: nextStatus };
      }
      return g;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Payment Gateway Accounts</h1>
        <p className="text-xs text-zinc-500 font-medium">Verify sandbox or live client payout terminals, transaction splits, and toggle direct credit card processing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gateways.map((g, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-black text-[13px]">{g.name}</h3>
                <p className="text-[10px] text-zinc-400 mt-0.5">{g.type}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${g.split === '5%' ? 'bg-zinc-100 text-zinc-650' : 'bg-indigo-50 text-indigo-700'}`}>Split: {g.split}</span>
            </div>
            
            <div className="flex justify-between items-center border-t border-zinc-100 pt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${g.status === 'Live Connected' ? 'bg-emerald-100 text-emerald-950' : 'bg-zinc-150 text-zinc-650'}`}>{g.status}</span>
              <button 
                onClick={() => handleToggleStatus(g.name)}
                className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Toggle Mode
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
