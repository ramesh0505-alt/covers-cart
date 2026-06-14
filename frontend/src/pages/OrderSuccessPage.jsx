import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const tickRef = useRef(null);

  // Data passed from CheckoutPage
  const [orderIdRef] = useState(() => location.state?.orderId || `CS-${Date.now().toString().slice(-8)}`);
  const orderId = location.state?.orderId || orderIdRef;
  const total     = location.state?.orderData?.totalAmount || location.state?.total || 0;
  const itemCount = location.state?.orderData?.items?.length || location.state?.itemCount || 1;
  const whatsappUrl = location.state?.whatsappUrl;
  const fallbackUrl = location.state?.fallbackUrl;

  // Animate tick on mount
  useEffect(() => {
    if (!tickRef.current) return;
    tickRef.current.style.strokeDashoffset = '0';
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf8fc] flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 pt-24 pb-32 max-w-md mx-auto w-full text-center">

        {/* Animated success circle */}
        <div className="relative w-28 h-28 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#e4e1e6" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="46"
              fill="none"
              stroke="#4648d4"
              strokeWidth="6"
              strokeDasharray="289"
              strokeDashoffset="289"
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease', strokeDashoffset: '0' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              ref={tickRef}
              className="w-12 h-12"
              viewBox="0 0 52 52"
              fill="none"
              stroke="#4648d4"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="80"
              style={{ strokeDashoffset: '80', transition: 'stroke-dashoffset 0.6s 0.9s ease' }}
            >
              <polyline points="14,27 22,35 38,19" />
            </svg>
          </div>
        </div>

        <span className="text-[10px] font-black text-[#4648d4] uppercase tracking-[0.2em] mb-3 block">
          Order Confirmed
        </span>
        <h1 className="text-3xl font-black text-[#111] mb-3 leading-tight">
          Your order<br />is on its way! 🎉
        </h1>
        <p className="text-sm text-[#4c4546] mb-8 leading-relaxed">
          We've received your order and will start processing it right away.
          {whatsappUrl ? (
            <span className="block mt-2 font-bold text-[#4648d4]">Please complete your payment via WhatsApp to confirm your order.</span>
          ) : (
            ' You\'ll get a confirmation once it ships.'
          )}
        </p>

        {/* Order details card */}
        <div className="w-full bg-white rounded-2xl border border-[#cfc4c5]/30 p-6 mb-8 text-left shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#cfc4c5]/20">
            <div>
              <p className="text-[10px] font-black text-[#4c4546] uppercase tracking-widest mb-1">Order ID</p>
              <p className="text-sm font-black text-[#111]">#{orderId.toString().slice(-8).toUpperCase()}</p>
            </div>
            <span className="bg-[#4648d4]/10 text-[#4648d4] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#4648d4]/20">
              Processing
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-[#4c4546] uppercase tracking-widest mb-1">Items</p>
              <p className="text-sm font-black text-[#111]">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#4c4546] uppercase tracking-widest mb-1">Total Paid</p>
              <p className="text-sm font-black text-[#111]">₹{Number(total).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#4c4546] uppercase tracking-widest mb-1">Delivery</p>
              <p className="text-sm font-black text-[#111]">3–5 Business Days</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#4c4546] uppercase tracking-widest mb-1">Payment</p>
              {whatsappUrl ? (
                <p className="text-sm font-black text-[#ba1a1a]">Pending Action</p>
              ) : (
                <p className="text-sm font-black text-[#4648d4]">Confirmed ✓</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Fallback to wa.me if deep link fails (mostly on desktop)
                setTimeout(() => {
                  window.open(fallbackUrl, '_blank');
                }, 500);
              }}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest text-center hover:bg-[#1DA851] transition-colors active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Pay via WhatsApp
            </a>
          )}
          <Link
            to="/orders"
            className="block w-full bg-[#111] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest text-center hover:bg-[#4648d4] transition-colors active:scale-95"
          >
            Track My Order
          </Link>
          <button
            onClick={() => navigate('/shop')}
            className="w-full border border-[#cfc4c5] text-[#111] py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#f0edf1] transition-colors active:scale-95"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support note */}
        <p className="mt-8 text-xs text-[#4c4546] leading-relaxed">
          Questions?{' '}
          <Link to="/contact" className="text-[#4648d4] font-semibold hover:underline">
            Contact support
          </Link>{' '}
          or visit your{' '}
          <Link to="/orders" className="text-[#4648d4] font-semibold hover:underline">
            order history
          </Link>.
        </p>
      </main>

      <BottomNav />
      <div className="h-16" />
    </div>
  );
}
