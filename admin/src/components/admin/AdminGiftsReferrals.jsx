import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminGiftsReferrals() {
  const [giftCards, setGiftCards] = useState([
    { id: 'GC-102', code: 'CS-GIFT-8392', initialVal: 2000, balance: 1250, customer: 'aditya@gmail.com', expiry: '2026-12-31' },
    { id: 'GC-101', code: 'CS-GIFT-0192', initialVal: 1000, balance: 1000, customer: 'sneha.rao@yahoo.com', expiry: '2026-09-30' }
  ]);

  const [referrals] = useState([
    { code: 'ROHAN10', clicks: 245, sales: 34, commission: 3400, rank: 1 },
    { code: 'SNEHA15', clicks: 120, sales: 12, commission: 1800, rank: 2 }
  ]);

  const handleIssueGift = () => {
    const newGc = {
      id: `GC-${Date.now().toString().slice(-3)}`,
      code: `CS-GIFT-${Math.floor(Math.random() * 9000 + 1000)}`,
      initialVal: 1000,
      balance: 1000,
      customer: 'guest-buyer@gmail.com',
      expiry: '2026-12-31'
    };
    setGiftCards(prev => [newGc, ...prev]);
    toast.success('Gift card generated and email sent!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Gift Cards & Referral Campaigns</h1>
          <p className="text-xs text-zinc-500 font-medium">Issue digital gift vouchers, configure commission incentives, and track top referral leaders.</p>
        </div>
        <button onClick={handleIssueGift} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Issue Gift Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gift Card table */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Active Gift Cards</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-150 text-[10px] uppercase font-bold text-zinc-400">
                  <th className="pb-2">Code</th>
                  <th className="pb-2">Associated Buyer</th>
                  <th className="pb-2 text-right">Original Value</th>
                  <th className="pb-2 text-right">Available Balance</th>
                </tr>
              </thead>
              <tbody>
                {giftCards.map(gc => (
                  <tr key={gc.id} className="border-b border-zinc-100 last:border-b-0">
                    <td className="py-2.5 font-mono font-bold text-indigo-600">{gc.code}</td>
                    <td className="py-2.5 text-zinc-500 font-semibold">{gc.customer}</td>
                    <td className="py-2.5 text-right text-zinc-400 font-semibold">₹{gc.initialVal}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">₹{gc.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrals table */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Referrals Leaderboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-150 text-[10px] uppercase font-bold text-zinc-400">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Referral Code</th>
                  <th className="pb-2 text-center">Clicks</th>
                  <th className="pb-2 text-center">Conversions</th>
                  <th className="pb-2 text-right">Commissions Payout</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map(ref => (
                  <tr key={ref.code} className="border-b border-zinc-100 last:border-b-0">
                    <td className="py-2.5 font-bold text-black">#{ref.rank}</td>
                    <td className="py-2.5 font-mono font-bold text-indigo-600">{ref.code}</td>
                    <td className="py-2.5 text-center text-zinc-500 font-semibold">{ref.clicks}</td>
                    <td className="py-2.5 text-center text-emerald-600 font-bold">{ref.sales} sales</td>
                    <td className="py-2.5 text-right font-bold text-zinc-800">₹{ref.commission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
