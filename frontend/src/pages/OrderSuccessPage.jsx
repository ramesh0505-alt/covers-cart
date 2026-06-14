import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from CheckoutPage
  const [orderIdRef] = useState(() => location.state?.orderId || `CS-${Date.now().toString().slice(-8)}`);
  const orderId = location.state?.orderId || orderIdRef;
  const orderData = location.state?.orderData || {};
  const total = orderData.totalAmount || location.state?.total || 0;
  const items = orderData.items || [];
  const customerName = location.state?.customerName || 'Valued Customer';
  const whatsappUrl = location.state?.whatsappUrl;
  const fallbackUrl = location.state?.fallbackUrl;

  const [btnText, setBtnText] = useState('Pay via WhatsApp');

  const handleWhatsappClick = (e) => {
    if (!whatsappUrl) return;
    e.preventDefault();
    setBtnText('Opening WhatsApp...');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      // Fallback to wa.me if deep link fails
      setTimeout(() => {
         window.open(fallbackUrl, '_blank');
         setBtnText('Pay via WhatsApp');
      }, 500);
    }, 1000);
  };

  return (
    <div className="min-h-[max(884px,100dvh)] bg-[var(--color-surface)] font-sans text-[var(--color-on-surface)] antialiased pb-32">
      <Header />
      
      <main className="pt-20 pb-32 px-[1.25rem] max-w-md mx-auto">
        {/* Status Header */}
        <section className="flex flex-col items-center text-center py-6 animate-fade-in duration-700">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4 relative overflow-hidden">
            <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full animate-ping"></div>
            <span className="material-symbols-outlined text-[48px] text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-black mb-2">
            {whatsappUrl ? 'Your Order Has Been Submitted' : 'Your Order is Confirmed! 🎉'}
          </h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] max-w-[280px]">
            {whatsappUrl ? 'Please complete payment through WhatsApp to confirm your order.' : 'We\'ve received your order and will start processing it right away.'}
          </p>
        </section>

        {/* Tracking Quick Info */}
        {whatsappUrl && (
          <div className="bg-[var(--color-surface-container-low)] rounded-xl p-4 flex justify-between items-center mb-6 border border-[var(--color-outline-variant)]/20">
            <div className="flex flex-col">
              <span className="font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-[10px]">Current Status</span>
              <span className="font-display text-amber-600 text-sm font-bold">Pending Payment</span>
            </div>
            <div className="h-8 w-[1px] bg-[var(--color-outline-variant)]/40"></div>
            <div className="flex flex-col items-end">
              <span className="font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-[10px]">Est. Verification</span>
              <span className="text-sm text-[var(--color-on-surface)] font-semibold">5-30 mins</span>
            </div>
          </div>
        )}

        {/* Order Summary Card */}
        <section className="bg-white rounded-xl border border-[var(--color-outline-variant)]/30 p-4 mb-6 overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-[var(--color-on-surface-variant)] uppercase text-xs">Order ID</h3>
              <p className="font-display font-bold text-black text-lg">#{orderId.toString().slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-[var(--color-on-surface-variant)] uppercase text-xs">Customer</h3>
              <p className="text-sm font-semibold text-black">{customerName}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 border-y border-[var(--color-outline-variant)]/20 py-4">
            {items.map((item, idx) => {
              const image = item.product?.images?.[0] && !item.product.images[0].startsWith('/assets/') ? item.product.images[0] : null;
              return (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-[#F8F8F8] rounded-lg overflow-hidden flex-shrink-0">
                    {image ? (
                      <img className="w-full h-full object-cover" src={image} alt={item.product?.title || 'Product'} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="material-symbols-outlined text-gray-400">smartphone</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-black">{item.product?.title || 'Custom Cover'}</p>
                    <p className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
                      {item.selectedModel || item.product?.deviceModels?.[0] || 'Universal'} • {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-black">₹{((item.price || item.product?.salePrice || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-display font-bold text-black text-lg">Total Amount</span>
            <span className="font-display font-bold text-black text-xl">₹{Number(total).toLocaleString('en-IN')}</span>
          </div>
        </section>

        {/* Payment Instructions (Only if WhatsApp) */}
        {whatsappUrl && (
          <section className="mb-6">
            <h3 className="font-display font-bold text-black text-lg mb-4">How to Pay</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                <p className="text-sm text-[var(--color-on-surface)]">Tap the <strong className="text-black">Pay via WhatsApp</strong> button below.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                <p className="text-sm text-[var(--color-on-surface)]">Send the auto-generated order message.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                <p className="text-sm text-[var(--color-on-surface)]">Our team will share the <strong className="text-black">UPI ID/QR Code</strong>.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                <p className="text-sm text-[var(--color-on-surface)]">Complete the payment of <strong className="text-black">₹{Number(total).toLocaleString('en-IN')}</strong>.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">5</div>
                <p className="text-sm text-[var(--color-on-surface)]">Send a <strong className="text-black">screenshot</strong> of the transaction.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">6</div>
                <p className="text-sm text-[var(--color-on-surface)]">Wait for our team to verify and confirm.</p>
              </div>
            </div>
          </section>
        )}

        {/* Status Timeline */}
        <section className="mb-6 p-4 bg-[#eae7eb]/30 rounded-xl">
          <h3 className="font-display font-bold text-black text-lg mb-4">Order Timeline</h3>
          <div className="relative pl-8 space-y-6">
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[var(--color-outline-variant)]"></div>
            
            {/* Step 1 */}
            <div className="relative flex items-center">
              <div className="absolute -left-8 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center z-10 border-4 border-[var(--color-surface)]">
                <span className="material-symbols-outlined text-white text-[14px]">check</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--color-on-surface)]">Order Submitted</span>
                <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">Just Now</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center">
              <div className={`absolute -left-8 w-6 h-6 rounded-full ${whatsappUrl ? 'bg-amber-500' : 'bg-green-600'} flex items-center justify-center z-10 border-4 border-[var(--color-surface)]`}>
                {whatsappUrl ? (
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                ) : (
                  <span className="material-symbols-outlined text-white text-[14px]">check</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${whatsappUrl ? 'text-amber-700' : 'text-[var(--color-on-surface)]'}`}>
                  {whatsappUrl ? 'Payment Pending' : 'Payment Verified'}
                </span>
                <span className={`text-xs font-semibold ${whatsappUrl ? 'text-amber-600' : 'text-[var(--color-on-surface-variant)]'}`}>
                  {whatsappUrl ? 'Action Required' : 'Completed'}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative flex items-center ${whatsappUrl ? 'opacity-40' : ''}`}>
              <div className={`absolute -left-8 w-6 h-6 rounded-full ${whatsappUrl ? 'bg-[var(--color-outline-variant)]' : 'bg-green-600'} flex items-center justify-center z-10 border-4 border-[var(--color-surface)]`}>
                 {!whatsappUrl && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--color-on-surface)]">Order Confirmed</span>
                <span className="text-xs font-semibold text-[var(--color-on-surface-variant)]">
                  {whatsappUrl ? 'Awaiting verification' : 'Processing starting'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        {whatsappUrl && (
          <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 p-4 rounded-lg mb-6">
            <div className="flex gap-2 items-start">
              <span className="material-symbols-outlined text-[#ba1a1a] text-sm mt-0.5">info</span>
              <p className="text-sm text-[#93000a] text-[13px] leading-relaxed">
                <strong>Important:</strong> Orders are not confirmed until manual payment verification. Items in your cart are not reserved until payment is verified. Unpaid orders may be cancelled after 2 hours.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-[var(--color-surface)]/90 backdrop-blur-2xl px-[1.25rem] py-4 border-t border-[var(--color-outline-variant)]/20 z-50 flex flex-col gap-2 pb-safe">
        {whatsappUrl && (
          <button 
            onClick={handleWhatsappClick}
            className="w-full h-14 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl flex items-center justify-center gap-2 font-bold active:scale-95 transition-all duration-200 shadow-lg shadow-green-500/20"
          >
            {btnText === 'Pay via WhatsApp' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Pay via WhatsApp
              </>
            ) : (
              <><span className="material-symbols-outlined animate-spin">sync</span> {btnText}</>
            )}
          </button>
        )}
        <button 
          onClick={() => navigate('/orders')}
          className="w-full h-12 bg-white border border-black text-black rounded-xl font-bold active:scale-95 transition-all duration-200"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
