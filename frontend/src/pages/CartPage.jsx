import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleApplyCoupon = async () => {
    if (!promoInput.trim()) return;
    try {
      const { data } = await API.post('/coupons/validate', { code: promoInput });
      setDiscountPercent(data.discount);
      toast.success(`Coupon ${data.code} applied! (${data.discount}% off)`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Invalid or expired coupon code');
    }
  };

  const discountAmount = Math.round((totalPrice * discountPercent) / 100);
  const finalTotal = totalPrice - discountAmount;

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans antialiased min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-black text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display">CoverScart</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/search')}
            className="hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-black text-2xl">search</span>
          </button>
        </div>
      </header>

      <main className="pt-20 px-[1.25rem] max-w-2xl mx-auto">
        {/* Cart Headline */}
        <div className="mb-[2.5rem]">
          <h2 className="text-2xl font-bold text-black font-display">Your Cart ({totalItems})</h2>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#cfc4c5]/25 p-8 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-[#cfc4c5] mb-4">shopping_cart</span>
            <p className="text-[#4c4546] font-semibold mb-6">Your cart is empty.</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-[#4648d4] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#2f2ebe] active:scale-95 transition-all cursor-pointer"
            >
              Shop Phone Cases
            </button>
          </div>
        ) : (
          <>
            <section className="space-y-[1.5rem]">
              {items.map((item) => {
                const image = item.product.images?.[0] && !item.product.images[0].startsWith('/assets/') ? item.product.images[0] : null;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-xl bg-white border border-[#cfc4c5]/20 transition-all hover:border-[#4648d4]/30 group"
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-[#f6f2f7] rounded-lg overflow-hidden border border-[#cfc4c5]/15">
                      {image ? (
                        <img className="w-full h-full object-cover" src={image} alt={item.product.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="material-symbols-outlined text-4xl text-gray-400">smartphone</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-[#1b1b1e] line-clamp-1">{item.product.title}</h3>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#4c4546] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                        <p className="text-xs text-[#4c4546] mt-1">
                          {item.selectedModel || item.product.deviceModels?.[0] || 'Universal'} • {item.selectedMaterial || item.product.materials?.[0] || 'Premium'}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-[#cfc4c5]/60 rounded-full px-2 py-1 gap-4 bg-white">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-[#eae7eb] rounded-full transition-colors font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-[#eae7eb] rounded-full transition-colors font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#4648d4]">
                          ₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Promo Code */}
            <section className="mt-[2.5rem]">
              <label className="text-xs font-semibold text-[#4c4546] block mb-2 tracking-wider uppercase">PROMO CODE</label>
              <div className="flex gap-2">
                <input
                  className="flex-grow px-4 py-3 rounded-lg border border-[#cfc4c5]/60 bg-[#f6f2f7] focus:border-black focus:ring-0 outline-none transition-all placeholder:text-[#7e7576]"
                  placeholder="Enter code"
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-[#4648d4] text-white rounded-lg font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </section>

            {/* Order Summary */}
            <section className="mt-[2.5rem] p-6 bg-[#f0edf1] rounded-xl">
              <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Order Summary</h3>
              <div className="space-y-3 border-b border-[#cfc4c5]/30 pb-4 text-xs font-medium">
                <div className="flex justify-between">
                  <span className="text-[#4c4546]">Subtotal</span>
                  <span className="font-semibold text-black">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4c4546]">Shipping</span>
                  <span className="font-semibold text-black">Free</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#4648d4]">
                    <span>Promo Discount</span>
                    <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-4 text-sm font-bold">
                <span>Total</span>
                <span className="text-black">₹{finalTotal.toLocaleString()}</span>
              </div>
            </section>

            {/* Action Button */}
            <div className="mt-[1.5rem]">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-black text-white rounded-lg font-bold shadow-lg hover:bg-neutral-800 active:scale-[0.98] transition-all cursor-pointer"
              >
                Checkout Now
              </button>
              <p className="text-center text-xs text-[#4c4546] mt-4 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                Secure 256-bit encrypted checkout
              </p>
            </div>
          </>
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-white/95 border-t border-[#cfc4c5]/20 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/shop')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Shop</span>
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center text-[#4648d4] relative transition-all cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Cart</span>
          <span className="absolute bottom-1 w-1 h-1 bg-[#4648d4] rounded-full" />
        </button>
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
