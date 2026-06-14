import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RewardsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Progress Ring variables
  const radius = 88;
  const circumference = radius * 2 * Math.PI;
  const [xp, setXp] = useState(0); // Animate from 0 to 850

  useEffect(() => {
    // Animate XP loading
    const timer = setTimeout(() => {
      setXp(850);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const strokeDashoffset = circumference - (xp / 1000) * circumference;

  const handleRedeemXP = () => {
    toast.success('Converted 500 XP to a 20% OFF discount coupon!', { icon: '🎫' });
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#c0c1ff] min-h-screen pb-24">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-black hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-10 h-10">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display cursor-pointer" onClick={() => navigate('/')}>CoverScart</h1>
        </div>
        <button onClick={() => navigate('/shop')} className="text-black hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-10 h-10">
          <span className="material-symbols-outlined text-2xl">search</span>
        </button>
      </header>

      <main className="pt-20 px-5 max-w-2xl mx-auto">
        {/* User Profile Header */}
        <section className="flex flex-col items-center mt-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#4648d4] shadow-md bg-white">
              {user?.avatarUrl ? (
                <img alt={user?.name || "User Profile"} className="w-full h-full object-cover" src={user.avatarUrl} />
              ) : (
                <div className="w-full h-full bg-[#e1e0ff] flex items-center justify-center font-bold text-[#07006c] text-2xl">
                  {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#4648d4] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <span className="text-[9px] font-bold tracking-wider uppercase">Elite</span>
            </div>
          </div>
          <h2 className="mt-4 text-lg font-bold text-black font-display">{user?.name || 'Customer'}</h2>
          <p className="text-[10px] font-bold text-[#4c4546] uppercase tracking-widest mt-1">Current Level: Gold</p>
        </section>

        {/* Circular Progress Section */}
        <section className="bg-white rounded-2xl p-6 flex flex-col items-center relative overflow-hidden border border-[#cfc4c5]/25 shadow-sm mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full">
              <circle className="text-[#eae7eb]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-[#4648d4] transition-all duration-1000 ease-out" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="88" 
                stroke="currentColor" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                strokeWidth="8"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%'
                }}
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-black font-display">{xp}</span>
              <span className="text-[10px] font-bold text-[#4c4546]/60 uppercase tracking-widest mt-0.5">/ 1000 XP</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-center text-[#4c4546] font-semibold">
            <span className="font-bold text-black">{1000 - xp} XP</span> more until you reach <span className="text-[#4648d4] font-bold">Platinum</span>
          </p>
        </section>

        {/* Mystery Streak Counter */}
        <section className="bg-[#e1e0ff]/30 text-[#07006c] p-5 rounded-2xl mb-6 flex items-center gap-4 relative overflow-hidden border border-[#cfc4c5]/15">
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-6xl">inventory_2</span>
          </div>
          <div className="bg-white/40 p-3 rounded-lg backdrop-blur-sm flex items-center justify-center">
            <span className="material-symbols-outlined text-[#4648d4]">auto_awesome</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-black">Mystery Streak</h3>
            <p className="text-xs text-[#4c4546] mt-0.5">3 Mystery Pouches bought. 2 more to unlock Elite Drop!</p>
          </div>
          <button 
            onClick={() => navigate('/mystery')}
            className="bg-white text-black border border-[#cfc4c5]/50 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm active:scale-95 transition-transform cursor-pointer hover:bg-neutral-50"
          >
            Shop
          </button>
        </section>

        {/* Unlocked Perks */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-base font-bold text-black font-display">Unlocked Perks</h3>
            <span className="text-[#4648d4] text-[10px] font-bold uppercase tracking-wider">Level Gold</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl flex items-start gap-4 border border-[#cfc4c5]/25 shadow-sm">
              <div className="bg-[#e1e0ff] p-2 rounded-lg text-[#07006c]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              </div>
              <div>
                <p className="font-bold text-xs text-black">Early Access</p>
                <p className="text-[11px] text-[#4c4546] mt-0.5">24h drop headstart</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl flex items-start gap-4 border border-[#cfc4c5]/25 shadow-sm">
              <div className="bg-[#e1e0ff] p-2 rounded-lg text-[#07006c]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>visibility_off</span>
              </div>
              <div>
                <p className="font-bold text-xs text-black">Hidden Drops</p>
                <p className="text-[11px] text-[#4c4546] mt-0.5">Exclusive app sections</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl flex items-start gap-4 border border-[#cfc4c5]/25 shadow-sm">
              <div className="bg-[#e1e0ff] p-2 rounded-lg text-[#07006c]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <div>
                <p className="font-bold text-xs text-black">20% Cashback</p>
                <p className="text-[11px] text-[#4c4546] mt-0.5">On every accessory</p>
              </div>
            </div>
          </div>
        </section>

        {/* Locked Perks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-base font-bold text-black/50 font-display">Locked Perks</h3>
            <span className="text-[#4c4546] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Elite Only
            </span>
          </div>
          <div className="space-y-3 opacity-60">
            <div className="bg-white border border-dashed border-[#cfc4c5]/60 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#4c4546]">folder_special</span>
                <p className="font-bold text-xs text-black">Secret Collections</p>
              </div>
              <span className="text-[10px] font-bold bg-[#eae7eb] text-[#4c4546] px-2.5 py-1 rounded">Lv. 10</span>
            </div>
            <div className="bg-white border border-dashed border-[#cfc4c5]/60 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#4c4546]">send_time_extension</span>
                <p className="font-bold text-xs text-black">Invite Only Drops</p>
              </div>
              <span className="text-[10px] font-bold bg-[#eae7eb] text-[#4c4546] px-2.5 py-1 rounded">Lv. 15</span>
            </div>
          </div>
        </section>

        {/* CTA / Footer Navigation */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => toast('Displaying all levels catalog')}
            className="w-full bg-black text-white py-4 rounded-lg text-xs font-bold active:scale-[0.98] transition-transform flex justify-center items-center gap-2 cursor-pointer hover:bg-neutral-800"
          >
            View All Rewards
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <button 
            onClick={handleRedeemXP}
            className="w-full bg-white border border-black text-black py-4 rounded-lg text-xs font-bold active:scale-[0.98] transition-transform cursor-pointer hover:bg-neutral-50"
          >
            Redeem XP for Discounts
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-white/95 border-t border-[#cfc4c5]/20 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/shop')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Shop</span>
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Cart</span>
        </button>
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4648d4] relative transition-transform cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
          <span className="absolute bottom-1 w-1 h-1 bg-[#4648d4] rounded-full" />
        </button>
      </nav>
    </div>
  );
}
