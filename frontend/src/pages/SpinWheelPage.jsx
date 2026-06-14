import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SpinWheelPage() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [wonPrize, setWonPrize] = useState('');

  const prizes = [
    "₹500 OFF Voucher",
    "FREE SHIPPING on all orders",
    "Exclusive ANIME DROP Access",
    "RARE CASE Selection",
    "MYSTERY UPGRADE on next purchase",
    "Better luck next time! Try again."
  ];

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Random rotation: at least 6 full circles + random slice angle
    const extraRotation = Math.floor(Math.random() * 360);
    const totalRotation = currentRotation + (360 * 6) + extraRotation;
    setCurrentRotation(totalRotation);

    // Calculate prize based on angle (6 segments of 60 degrees each)
    setTimeout(() => {
      const normalizedAngle = (totalRotation % 360);
      // Inverse map of rotation angle to match SVG segment alignment
      const prizeIndex = Math.floor(((360 - normalizedAngle) % 360) / 60);
      const prize = prizes[prizeIndex];

      setWonPrize(prize);
      setShowModal(true);
      setIsSpinning(false);
      
      if (prizeIndex !== 5) {
        toast.success(`You won: ${prize}!`, { icon: '🎁' });
      } else {
        toast('Try again tomorrow!', { icon: '🔄' });
      }
    }, 4000);
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#c0c1ff] overflow-x-hidden min-h-screen pb-24">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-10 h-10">
            <span className="material-symbols-outlined text-black">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display cursor-pointer" onClick={() => navigate('/')}>CoverScart</h1>
        </div>
        <button onClick={() => navigate('/shop')} className="hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-10 h-10">
          <span className="material-symbols-outlined text-black">search</span>
        </button>
      </header>

      {/* Main Canvas */}
      <main className="relative pt-20 px-5 flex flex-col items-center">
        {/* Header Text */}
        <div className="text-center mt-6 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-black font-display mb-2">Spin the Case</h2>
          <p className="text-xs text-[#4c4546] font-semibold max-w-[280px] mx-auto">Win exclusive rewards, rare cases, and shopping vouchers.</p>
        </div>

        {/* The Wheel Area */}
        <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center mb-8">
          {/* Pointer */}
          <div className="absolute -top-3 z-30 flex justify-center w-full">
            <span className="material-symbols-outlined text-[#4648d4] text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              arrow_drop_down
            </span>
          </div>

          {/* Prize Wheel */}
          <div 
            id="prizeWheel"
            style={{
              transform: `rotate(${currentRotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
            }}
            className="relative w-full h-full rounded-full border-[12px] border-black bg-[#f0edf1] shadow-2xl overflow-hidden"
          >
            {/* Prize segments drawn via SVG */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Segment 1: ₹500 OFF */}
              <path d="M50,50 L50,0 A50,50 0 0,1 93.3,25 Z" fill="#ffffff" stroke="#cfc4c5" strokeWidth="0.2"></path>
              <text fill="#000000" fontFamily="Inter" fontSize="4" fontWeight="600" textAnchor="middle" transform="rotate(30, 75, 25)" x="75" y="25.5">₹500 OFF</text>
              
              {/* Segment 2: FREE SHIPPING */}
              <path d="M50,50 L93.3,25 A50,50 0 0,1 93.3,75 Z" fill="#f6f2f7" stroke="#cfc4c5" strokeWidth="0.2"></path>
              <text fill="#4648d4" fontFamily="Inter" fontSize="3.5" fontWeight="600" textAnchor="middle" transform="rotate(90, 85, 50)" x="85" y="51">FREE SHIP</text>
              
              {/* Segment 3: ANIME DROP */}
              <path d="M50,50 L93.3,75 A50,50 0 0,1 50,100 Z" fill="#ffffff" stroke="#cfc4c5" strokeWidth="0.2"></path>
              <text fill="#000000" fontFamily="Inter" fontSize="4" fontWeight="600" textAnchor="middle" transform="rotate(150, 75, 75)" x="75" y="75.5">ANIME</text>
              
              {/* Segment 4: RARE CASE */}
              <path d="M50,50 L50,100 A50,50 0 0,1 6.7,75 Z" fill="#f6f2f7" stroke="#cfc4c5" strokeWidth="0.2"></path>
              <text fill="#4648d4" fontFamily="Inter" fontSize="4" fontWeight="600" textAnchor="middle" transform="rotate(210, 25, 75)" x="25" y="75.5">RARE CASE</text>
              
              {/* Segment 5: MYSTERY UPGRADE */}
              <path d="M50,50 L6.7,75 A50,50 0 0,1 6.7,25 Z" fill="#ffffff" stroke="#cfc4c5" strokeWidth="0.2"></path>
              <text fill="#000000" fontFamily="Inter" fontSize="3.5" fontWeight="600" textAnchor="middle" transform="rotate(270, 15, 50)" x="15" y="51">MYSTERY</text>
              
              {/* Segment 6: TRY AGAIN */}
              <path d="M50,50 L6.7,25 A50,50 0 0,1 50,0 Z" fill="#f6f2f7" stroke="#cfc4c5" strokeWidth="0.2"></path>
              <text fill="#7e7576" fontFamily="Inter" fontSize="4" fontWeight="600" textAnchor="middle" transform="rotate(330, 25, 25)" x="25" y="25.5">TRY AGAIN</text>
            </svg>

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Spin Actions */}
        <div className="w-full max-w-[320px] text-center space-y-4">
          <p className="text-[10px] font-bold text-[#4648d4] tracking-widest uppercase">1 Free Spin Available Today</p>
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            {isSpinning ? "Spinning..." : "Spin Now"}
          </button>
        </div>

        {/* Reward History */}
        <div className="w-full max-w-[320px] mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-black font-display">Reward History</h3>
            <button onClick={() => toast('Displaying all past rewards')} className="text-xs font-semibold text-[#4648d4] hover:underline cursor-pointer">View All</button>
          </div>
          <div className="space-y-3">
            {/* Reward Card 1 */}
            <div className="bg-white p-4 rounded-2xl border border-[#cfc4c5]/25 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-[#e1e0ff] rounded-full flex items-center justify-center text-[#4648d4] flex-shrink-0">
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black truncate">₹200 Discount Voucher</p>
                <p className="text-[10px] text-[#4c4546] font-semibold mt-0.5">Unlocked 2 days ago</p>
              </div>
              <span className="material-symbols-outlined text-[#cfc4c5]">chevron_right</span>
            </div>

            {/* Reward Card 2 */}
            <div className="bg-white p-4 rounded-2xl border border-[#cfc4c5]/25 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 bg-[#f6f2f7] rounded-full flex items-center justify-center text-[#7e7576] flex-shrink-0">
                <span className="material-symbols-outlined text-xl">local_shipping</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-black truncate">Free Shipping</p>
                <p className="text-[10px] text-[#4c4546] font-semibold mt-0.5">Used on Order #1204</p>
              </div>
              <span className="text-[9px] font-bold text-[#cfc4c5] uppercase tracking-wider">Applied</span>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl scale-100 transition-all border border-[#cfc4c5]/15">
            <div className="w-20 h-20 bg-[#e1e0ff] mx-auto rounded-full flex items-center justify-center mb-4 text-[#4648d4]">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                card_giftcard
              </span>
            </div>
            <h3 className="text-xl font-bold text-black font-display mb-1">Congratulations!</h3>
            <p className="text-xs text-[#4c4546] font-semibold mb-6">You won: {wonPrize}</p>
            <div className="bg-[#f6f2f7] p-4 rounded-xl mb-6 flex flex-col items-center border border-[#cfc4c5]/10">
              <span className="text-[9px] font-bold text-[#4c4546] uppercase tracking-wider mb-1">Coupon Code</span>
              <span className="text-lg font-bold text-black tracking-widest font-display">WHEEL_GIFT24</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="w-full bg-white border border-[#cfc4c5] py-3 rounded-lg text-xs font-semibold hover:bg-neutral-50 active:scale-95 transition-transform cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button 
                className="w-full bg-black text-white py-3 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-transform cursor-pointer flex items-center justify-center"
                onClick={() => { setShowModal(false); navigate('/shop'); }}
              >
                Go Shop
              </button>
            </div>
          </div>
        </div>
      )}

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
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
