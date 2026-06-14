import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RevealPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize Canvas scratch layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with silver scratch layer
    ctx.fillStyle = '#e4e1e6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add grain texture
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
    }
    ctx.globalAlpha = 1.0;

    // Composite for destination-out scratching
    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const drawScratch = (e) => {
    if (!isDrawing || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(e);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2);
    ctx.fill();

    checkPercentage();
  };

  const checkPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    if (percentage > 40) {
      triggerReveal();
    }
  };

  const triggerReveal = () => {
    setRevealed(true);
    createConfetti();
    toast.success('Congratulations! Rare case revealed.', { icon: '✨' });
  };

  const createConfetti = () => {
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '999';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.backgroundColor = ['#4648d4', '#000000', '#c0c1ff'][Math.floor(Math.random() * 3)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = '50%';
      document.body.appendChild(confetti);

      const animation = confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(Math.random() - 0.5) * 150}px, 100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      animation.onfinish = () => confetti.remove();
    }
  };

  const handleShare = () => {
    toast.success('Shared your RARE Midnight Aura unboxing to the CoverScart Feed!', { icon: '🚀' });
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#c0c1ff] min-h-screen flex flex-col pb-32">
      {/* TopAppBar */}
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

      <main className="flex-grow pt-20 px-5 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        {!revealed ? (
          <div className="w-full text-center">
            {/* Intro Text */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black font-display mb-1">Mystery Unlocked</h2>
              <p className="text-xs text-[#4c4546] font-semibold">Your order has arrived. Reveal your unique case below.</p>
            </div>

            {/* Reveal Zone */}
            <div className="relative w-full aspect-[3/4] bg-[#eae7eb] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 border border-[#cfc4c5]/25 shadow-2xl">
              <div className="absolute inset-0 z-10 cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full block"
                  onMouseDown={() => setIsDrawing(true)}
                  onTouchStart={(e) => { setIsDrawing(true); e.preventDefault(); }}
                  onMouseUp={() => setIsDrawing(false)}
                  onTouchEnd={() => setIsDrawing(false)}
                  onMouseMove={drawScratch}
                  onTouchMove={(e) => { drawScratch(e); e.preventDefault(); }}
                />
              </div>
              <div className="relative z-0 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#eae7eb] border-2 border-dashed border-[#4648d4] text-[#4648d4] rounded-full flex items-center justify-center mb-5 animate-pulse">
                  <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <p className="text-[10px] font-bold text-[#4648d4] uppercase tracking-widest">Scratch To Reveal</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full text-center animate-fade-in">
            {/* Revealed Content */}
            <div className="relative w-full aspect-[3/4] mb-6 group">
              {/* Rare Tag */}
              <div className="absolute top-4 left-4 z-20 bg-[#4648d4] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                RARE EDITION
              </div>
              <div className="w-full h-full bg-[#f8f8f8] rounded-2xl overflow-hidden border border-[#cfc4c5]/25 shadow-md">
                <img
                  alt="Midnight Aura Case"
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrP0IryaHfJmOmOdhiO3ODSLK6-pZGyM0eHudvJnPk5siEXP2tTmq2fBHbBG-EwC-txqrsxqwtO1HQhnCgFCRVZEX_U2fYfdAfjBVk81cDzO4QI5CM_1yixEu4u6zQqcaiUv6Jyk4GA3hO6OsdOhuvNIpMIMWo_aZf_O0oT7TNwlxUJ8msDFqZHyV6UhEKAbu0m8zk_0RNXAa9-l0mumGgRMuo_eLIMwqAgyvxQjY8MF-rUCmTDcUBdu6YLECKOL9V4_8k_epGGwgI"
                />
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-black font-display">Midnight Aura</h2>
              <p className="text-xs text-[#4c4546] font-semibold mt-2 max-w-[280px] mx-auto leading-relaxed">
                A cosmic blend of deep indigo and shifting starlight. Exclusively yours.
              </p>
            </div>

            {/* Rating Section */}
            <div className="bg-[#f6f2f7] w-full p-5 rounded-2xl border border-[#cfc4c5]/20 mb-6 text-center">
              <p className="text-[10px] font-bold text-[#4c4546] uppercase tracking-wider mb-3">RATE THE MYSTERY</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`material-symbols-outlined text-2xl transition-colors cursor-pointer ${
                      star <= rating ? 'text-[#4648d4]' : 'text-[#cfc4c5]'
                    }`}
                    style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    star
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleShare}
                className="w-full bg-black text-white py-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-sm">share</span>
                Share Your Reveal
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-white border border-black text-black py-4 rounded-lg text-xs font-bold hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
              >
                Back to Order History
              </button>
            </div>
          </div>
        )}
      </main>

      {/* BottomNavBar */}
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
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
