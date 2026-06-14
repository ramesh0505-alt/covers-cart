import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminLoyalty() {
  const [tiers] = useState([
    { id: 'tier-bronze', name: 'Bronze', spend: '₹0 - ₹2,000', rate: '1x points', benefits: 'Standard checkout, custom newsletter access' },
    { id: 'tier-silver', name: 'Silver', spend: '₹2,000 - ₹5,000', rate: '1.2x points', benefits: '5% seasonal drop discount code, exclusive packaging' },
    { id: 'tier-gold', name: 'Gold', spend: '₹5,000 - ₹15,000', rate: '1.5x points', benefits: '10% sitewide coupon code, free mystery stickers' },
    { id: 'tier-elite', name: 'Elite', spend: '₹15,000+', rate: '2x points', benefits: 'Early access to drops, dedicated designer priority support' }
  ]);

  const [rules, setRules] = useState({
    pointsPerRupee: 0.1,
    redemptionRate: 10, // 10 points = 1 rupee
    bonusSignUp: 100,
    expirationMonths: 12
  });

  const handleSaveRules = (e) => {
    e.preventDefault();
    toast.success('Loyalty Points rules updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Loyalty Program Settings</h1>
        <p className="text-xs text-zinc-500 font-medium">Configure rewards tiers thresholds, point rates multipliers, redemption rules, and bonus rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tiers List */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Loyalty Program Tiers Matrix</h3>
          <div className="space-y-3.5">
            {tiers.map((tier) => (
              <div key={tier.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-black text-sm">{tier.name} Tier</span>
                  <span className="font-mono text-zinc-500 font-bold bg-white px-2 py-0.5 rounded border border-zinc-200">Required Spend: {tier.spend}</span>
                </div>
                <div className="text-xs text-zinc-600 flex justify-between">
                  <span>Earn Rate: <strong className="text-indigo-600">{tier.rate}</strong></span>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase">BENEFITS: {tier.benefits}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Point Calculations Rules */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Points Redemption Rules</h3>
          <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Points Awarded (Per ₹1 spent)</label>
              <input 
                type="number" 
                step="0.01"
                value={rules.pointsPerRupee}
                onChange={(e) => setRules({ ...rules, pointsPerRupee: Number(e.target.value) })}
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Redemption Value (Points per ₹1 discount)</label>
              <input 
                type="number" 
                value={rules.redemptionRate}
                onChange={(e) => setRules({ ...rules, redemptionRate: Number(e.target.value) })}
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Sign Up Bonus Points</label>
              <input 
                type="number" 
                value={rules.bonusSignUp}
                onChange={(e) => setRules({ ...rules, bonusSignUp: Number(e.target.value) })}
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Points Expiry Window (Months)</label>
              <input 
                type="number" 
                value={rules.expirationMonths}
                onChange={(e) => setRules({ ...rules, expirationMonths: Number(e.target.value) })}
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-black text-white font-bold py-3 rounded-xl active:scale-95 transition-all text-center cursor-pointer text-xs"
            >
              Update Program Rules
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
