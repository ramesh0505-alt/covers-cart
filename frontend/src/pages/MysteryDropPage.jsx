import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function MysteryDropPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 18 });
  const [stockRemaining, setStockRemaining] = useState(42);
  const [unlocking, setUnlocking] = useState(false);

  // Timer countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate slight stock reduction for realism
  useEffect(() => {
    const stockTimer = setInterval(() => {
      setStockRemaining(prev => Math.max(12, prev - (Math.random() > 0.7 ? 1 : 0)));
    }, 12000);
    return () => clearInterval(stockTimer);
  }, []);

  const handleUnlockDrop = () => {
    setUnlocking(true);
    toast.loading('Unlocking your daily mystery drop...', { id: 'unlocking-drop' });

    setTimeout(() => {
      const dropItem = {
        id: `mystery-drop-${Date.now()}`,
        title: 'Daily Mystery Pouch Drop (Leather + 2 Accessories)',
        price: 1899,
        salePrice: null,
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAt4szQuKO03Ih4mnjOUTNjCgvLnEx0EFuTqiMRZrh7aUR9U9x8zYXZH9GOgDRQZf0kbr65XzKmrKJiFWMlVjNcApmIbgzEF4fgsM9-LtgxImYYYlypWIvtc2hXmjkcUlYLppbW9c85ZUx_V_lZlKZYM2472NQ7O4tJxEI00cEZcZh-tDaECwlFyKfP0Fy1Eq2NmUG9AdFbR8iIVFqEitZk14cvYdbB1I8lYamckzLQS6sYMZJZh5CBrYbAV6TCqBKPLcBcYOEcrq2r'],
        deviceModels: ['Universal'],
        materials: ['Premium Leather & Hybrid']
      };

      addToCart(dropItem, 1);
      toast.success('Mystery drop pouch added to cart!', { id: 'unlocking-drop', icon: '✨' });
      setUnlocking(false);
      navigate('/cart');
    }, 1200);
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#c0c1ff] overflow-x-hidden min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 text-black hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-black font-display cursor-pointer" onClick={() => navigate('/')}>CoverScart</h1>
        <button 
          onClick={() => navigate('/search')}
          className="flex items-center justify-center w-10 h-10 text-black hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="relative min-h-screen pt-16 pb-24 overflow-hidden">
        <div className="relative z-10 px-[1.25rem] flex flex-col items-center">
          {/* Heading */}
          <div className="mt-8 text-center">
            <p className="text-xs font-semibold text-[#4648d4] tracking-[0.2em] mb-2 uppercase">LIMITED TIME EVENT</p>
            <h2 className="text-4xl font-extrabold text-black font-display">Mystery Drop #07</h2>
          </div>

          {/* Central Pouch Container */}
          <div className="relative mt-8 group">
            <div className="w-64 h-80 bg-[#f0edf1] rounded-xl overflow-hidden relative border border-[#cfc4c5]/20 shadow-2xl">
              <img 
                className="w-full h-full object-cover" 
                alt="Daily Mystery Drop Package" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt4szQuKO03Ih4mnjOUTNjCgvLnEx0EFuTqiMRZrh7aUR9U9x8zYXZH9GOgDRQZf0kbr65XzKmrKJiFWMlVjNcApmIbgzEF4fgsM9-LtgxImYYYlypWIvtc2hXmjkcUlYLppbW9c85ZUx_V_lZlKZYM2472NQ7O4tJxEI00cEZcZh-tDaECwlFyKfP0Fy1Eq2NmUG9AdFbR8iIVFqEitZk14cvYdbB1I8lYamckzLQS6sYMZJZh5CBrYbAV6TCqBKPLcBcYOEcrq2r"
              />
              {/* Blurred Teaser Overlay */}
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/20">
                <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
                  <span className="material-symbols-outlined text-white text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  <p className="text-white font-semibold text-lg font-display">Hiding Something...</p>
                </div>
              </div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-pulse"></div>
            </div>
            {/* Floating Labels around pouch */}
            <div className="absolute -top-4 -right-4 bg-[#4648d4] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg transform rotate-6">
              ₹5,000+ VALUE
            </div>
          </div>

          {/* Cinematic Countdown */}
          <div className="mt-[1.5rem] text-center">
            <p className="text-xs font-semibold text-[#4c4546] mb-2 uppercase tracking-widest">Drop Ends In</p>
            <div className="flex gap-4 items-center justify-center text-4xl font-bold text-black font-display">
              <div className="flex flex-col">
                <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-semibold uppercase tracking-tighter opacity-50">Hrs</span>
              </div>
              <span className="mb-4">:</span>
              <div class="flex flex-col">
                <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-semibold uppercase tracking-tighter opacity-50">Min</span>
              </div>
              <span className="mb-4">:</span>
              <div className="flex flex-col">
                <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-semibold uppercase tracking-tighter opacity-50">Sec</span>
              </div>
            </div>
          </div>

          {/* Main Info Card */}
          <div className="w-full mt-[2.5rem] bg-white p-6 rounded-xl border border-[#cfc4c5]/30 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-black font-display">Daily Mystery Pouch</h3>
                <p className="text-xs text-[#4c4546] mt-1">Guaranteed 1 Premium Leather Case + 2 Secret Accessories.</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-black">₹1,899</p>
                <p className="text-xs text-[#4c4546] line-through opacity-50">₹4,499</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-[#4c4546]">STOCK REMAINING</span>
                <span className="text-[#4648d4]">{stockRemaining}/100</span>
              </div>
              <div className="h-2 w-full bg-[#eae7eb] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4648d4] rounded-full transition-all duration-1000" 
                  style={{ width: `${stockRemaining}%` }}
                ></div>
              </div>
            </div>
            {/* CTA */}
            <button 
              disabled={unlocking}
              onClick={handleUnlockDrop}
              className="w-full h-14 bg-black text-white rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer hover:bg-neutral-800 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
              {unlocking ? 'Unlocking...' : 'Unlock Drop'}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 w-full mt-8 mb-8">
            <div className="flex items-center gap-3 p-3 bg-[#f6f2f7] rounded-lg border border-[#cfc4c5]/20">
              <span className="material-symbols-outlined text-[#4648d4]">verified</span>
              <span className="text-xs font-semibold">Guaranteed Fit</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#f6f2f7] rounded-lg border border-[#cfc4c5]/20">
              <span className="material-symbols-outlined text-[#4648d4]">bolt</span>
              <span className="text-xs font-semibold">Instant Unlock</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
