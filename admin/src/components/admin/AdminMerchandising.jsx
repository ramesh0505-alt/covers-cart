import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminMerchandising() {
  const [boostRules, setBoostRules] = useState([
    { id: 'rule-1', trigger: 'iphone case', action: 'Boost MagSafe Cases', status: 'Active' },
    { id: 'rule-2', trigger: 'leather cover', action: 'Boost Premium Leather Wallet Case', status: 'Active' },
    { id: 'rule-3', trigger: 'anime case', action: 'Boost Demon Slayer Giyu Case', status: 'Active' }
  ]);

  const [zeroSearches] = useState([
    { term: 'carbon fiber case', count: 142 },
    { term: 'iphone 17 pro max cover', count: 98 },
    { term: 'liquid silicone neon', count: 54 }
  ]);

  const [popularSearches] = useState([
    { term: 'MagSafe case', count: 1250 },
    { term: 'Demon Slayer', count: 840 },
    { term: 'Custom Case', count: 620 }
  ]);

  const [newRule, setNewRule] = useState({ trigger: '', action: '' });

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.trigger || !newRule.action) return;
    setBoostRules(prev => [...prev, { id: `rule-${Date.now()}`, ...newRule, status: 'Active' }]);
    toast.success('Search merchandising rule added!');
    setNewRule({ trigger: '', action: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Search & Merchandising Engine</h1>
        <p className="text-xs text-zinc-500 font-medium">Configure search boosting, synonyms, demote out-of-stock covers, and view search query analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Boost & demote rules */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Product Boosting Rules</h3>
          
          <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Search Term Trigger</label>
              <input 
                type="text" 
                value={newRule.trigger}
                onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                placeholder="e.g. iphone case"
                className="w-full border border-zinc-200 p-2.5 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Merchandising Action</label>
              <input 
                type="text" 
                value={newRule.action}
                onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                placeholder="e.g. Boost MagSafe Cases"
                className="w-full border border-zinc-200 p-2.5 rounded-lg"
              />
            </div>
            <button type="submit" className="bg-black text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all cursor-pointer">
              Deploy Boosting
            </button>
          </form>

          <div className="space-y-2.5">
            {boostRules.map((rule) => (
              <div key={rule.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex justify-between items-center">
                <div>
                  <div className="font-bold text-black">If user searches: <span className="font-mono text-indigo-600">"{rule.trigger}"</span></div>
                  <div className="text-[10px] text-zinc-400 font-medium mt-0.5">Merch Action: {rule.action}</div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded">{rule.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Analytics */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-5">
          <div>
            <h3 className="font-display font-extrabold text-sm text-black">Popular Search Terms</h3>
            <div className="space-y-2 mt-2">
              {popularSearches.map((p, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] font-semibold text-zinc-650">
                  <span>{p.term}</span>
                  <span className="font-bold text-zinc-900">{p.count} searches</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-100 pt-4">
            <h3 className="font-display font-extrabold text-sm text-black text-red-700">Zero Result Searches</h3>
            <div className="space-y-2 mt-2">
              {zeroSearches.map((z, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] font-semibold text-zinc-650">
                  <span className="font-mono text-zinc-500">"{z.term}"</span>
                  <span className="font-bold text-red-650">{z.count} failures</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
