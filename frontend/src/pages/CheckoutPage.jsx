import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import toast from 'react-hot-toast';
import { trackCheckoutStarted, trackWhatsAppCheckout, trackOrderCreated } from '../utils/analytics';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (items.length > 0) {
      trackCheckoutStarted(totalPrice, items);
    }
  }, [items, totalPrice]);

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateProv, setStateProv] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Standard');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [whatsappNumber, setWhatsappNumber] = useState('919502104919');

  useEffect(() => {
    API.get('/cms/settings')
      .then(res => {
        if (res.data?.whatsappNumber) setWhatsappNumber(res.data.whatsappNumber);
      })
      .catch(e => console.error(e));
  }, []);

  const shippingCost = deliveryMethod === 'Express' ? 999 : 0;
  const taxAmount = Math.round(totalPrice * 0.08); // 8% tax rate
  const finalTotal = totalPrice + shippingCost + taxAmount;

  const handlePlaceOrder = async () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    
    // Mobile Validation: Required, 10 digits, Indian format (starts with 6-9)
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(mobile.replace(/\s+/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!email.trim()) newErrors.email = 'Email is required.';
    if (!addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required.';
    if (!city.trim()) newErrors.city = 'City is required.';
    if (!stateProv.trim()) newErrors.stateProv = 'State is required.';
    
    // Pincode Validation: Required, 6 digits
    if (!pincode.trim()) {
      newErrors.pincode = 'Pincode is required.';
    } else if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the shipping details.');
      return;
    }
    
    setErrors({});

    setSubmitting(true);
    try {
      const orderData = {
        userId: user?.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price,
          device: item.selectedModel || item.product.deviceModels?.[0] || 'Universal',
          material: item.selectedMaterial || item.product.materials?.[0] || 'Premium'
        })),
        totalAmount: finalTotal,
        shippingAddress: `${addressLine1}, ${addressLine2 ? addressLine2 + ', ' : ''}${city}, ${stateProv} - ${pincode}`,
        paymentMethod: 'WHATSAPP'
      };

      const response = await API.post('/orders', orderData);
      const newOrderId = response.data?.id || response.data?.orderId || `CS-${Date.now().toString().slice(-8)}`;
      
      clearCart();
      
      // Analytics Tracking
      trackOrderCreated(newOrderId, finalTotal, orderData.items);
      trackWhatsAppCheckout(finalTotal);

      // WhatsApp message construction
      const itemsList = items.map(item => 
        `* ${item.product.title} (${item.selectedModel || item.product.deviceModels?.[0] || 'Universal'} / ${item.selectedMaterial || item.product.materials?.[0] || 'Premium'}) x${item.quantity}`
      ).join('%0A');

      const message = `Hello CoverScart,%0A%0AI would like to place an order.%0A%0AOrder ID: ${newOrderId}%0AName: ${fullName}%0APhone: ${mobile}%0AEmail: ${email}%0AAddress: ${orderData.shippingAddress}%0A%0AProducts:%0A${itemsList}%0A%0ATotal: ₹${finalTotal}%0A%0APlease send payment instructions.`;

      const whatsappUrl = `whatsapp://send?phone=${whatsappNumber}&text=${message}`;
      const fallbackUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Navigate to order success instead of replacing location
      navigate('/order-success', { state: { orderId: newOrderId, whatsappUrl, fallbackUrl, orderData } });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Order placement failed. Please try again.');
      setSubmitting(false);
    }
  };


  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans min-h-screen pb-32">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)} 
          className="hover:opacity-70 transition-opacity p-2 active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-black text-2xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-black font-display">Checkout</h1>
        <button className="hover:opacity-70 transition-opacity p-2 active:scale-95 transition-transform duration-150 cursor-pointer">
          <span className="material-symbols-outlined text-black text-2xl">help_outline</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-[1.25rem] max-w-2xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-[2.5rem] px-2">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold font-display">1</div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-black">Shipping</span>
          </div>
          <div className="flex-1 h-[1px] bg-[#cfc4c5]/60 mx-4 -mt-4"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full border border-[#cfc4c5]/60 text-[#4c4546] flex items-center justify-center text-xs font-bold font-display">2</div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#4c4546]">Delivery</span>
          </div>
          <div className="flex-1 h-[1px] bg-[#cfc4c5]/60 mx-4 -mt-4"></div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full border border-[#cfc4c5]/60 text-[#4c4546] flex items-center justify-center text-xs font-bold font-display">3</div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#4c4546]">Payment</span>
          </div>
        </div>

        {/* Section 1: Customer Information */}
        <section className="space-y-[1.5rem] mb-[2.5rem]">
          <h2 className="text-lg font-bold text-black uppercase tracking-wider font-display">Customer Information</h2>
          <div className="space-y-[1rem]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">Full Name</label>
              <input 
                className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                placeholder="John Doe" 
                type="text"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); setErrors(prev => ({...prev, fullName: null})); }}
              />
              {errors.fullName && <p className="text-xs text-[var(--color-error)] mt-1">{errors.fullName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-[1rem]">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">Mobile Number</label>
                <input 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.mobile ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                  placeholder="99999 99999" 
                  type="tel"
                  value={mobile}
                  onChange={(e) => { setMobile(e.target.value); setErrors(prev => ({...prev, mobile: null})); }}
                />
                {errors.mobile && <p className="text-xs text-[var(--color-error)] mt-1">{errors.mobile}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">Email</label>
                <input 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                  placeholder="john@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: null})); }}
                />
                {errors.email && <p className="text-xs text-[var(--color-error)] mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1b: Shipping Address */}
        <section className="space-y-[1.5rem] mb-[2.5rem]">
          <h2 className="text-lg font-bold text-black uppercase tracking-wider font-display">Shipping Address</h2>
          <div className="space-y-[1rem]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">Address Line 1</label>
              <input 
                className={`w-full px-4 py-3 rounded-lg border ${errors.addressLine1 ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                placeholder="House No, Building Name" 
                type="text"
                value={addressLine1}
                onChange={(e) => { setAddressLine1(e.target.value); setErrors(prev => ({...prev, addressLine1: null})); }}
              />
              {errors.addressLine1 && <p className="text-xs text-[var(--color-error)] mt-1">{errors.addressLine1}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">Address Line 2 (Optional)</label>
              <input 
                className="w-full px-4 py-3 rounded-lg border border-[#cfc4c5]/60 bg-white focus:border-black focus:ring-0 outline-none text-sm" 
                placeholder="Street, Landmark" 
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-[1rem]">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">City</label>
                <input 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                  placeholder="Mumbai" 
                  type="text"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setErrors(prev => ({...prev, city: null})); }}
                />
                {errors.city && <p className="text-xs text-[var(--color-error)] mt-1">{errors.city}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">State</label>
                <input 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.stateProv ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                  placeholder="Maharashtra" 
                  type="text"
                  value={stateProv}
                  onChange={(e) => { setStateProv(e.target.value); setErrors(prev => ({...prev, stateProv: null})); }}
                />
                {errors.stateProv && <p className="text-xs text-[var(--color-error)] mt-1">{errors.stateProv}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[1rem]">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#4c4546] uppercase ml-1 block">Pincode</label>
                <input 
                  className={`w-full px-4 py-3 rounded-lg border ${errors.pincode ? 'border-[var(--color-error)]' : 'border-[#cfc4c5]/60'} bg-white focus:border-black focus:ring-0 outline-none text-sm`}
                  placeholder="400001" 
                  type="text"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setErrors(prev => ({...prev, pincode: null})); }}
                />
                {errors.pincode && <p className="text-xs text-[var(--color-error)] mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        </section>


        {/* Section 2: Delivery Method */}
        <section className="space-y-[1.5rem] mb-[2.5rem]">
          <h2 className="text-lg font-bold text-black uppercase tracking-wider font-display">Delivery Method</h2>
          <div className="grid grid-cols-1 gap-[1rem]">
            {/* Method 1 */}
            <label 
              onClick={() => setDeliveryMethod('Standard')}
              className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                deliveryMethod === 'Standard' 
                  ? 'border-black bg-[#e1e0ff]/10' 
                  : 'border-[#cfc4c5]/60 bg-white hover:border-black'
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-black text-sm">Standard Shipping</p>
                <p className="text-xs text-[#4c4546]">3-5 Business Days</p>
              </div>
              <span className="text-black font-bold text-sm">Free</span>
              <div className="ml-4 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                {deliveryMethod === 'Standard' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
              </div>
            </label>
            {/* Method 2 */}
            <label 
              onClick={() => setDeliveryMethod('Express')}
              className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                deliveryMethod === 'Express' 
                  ? 'border-black bg-[#e1e0ff]/10' 
                  : 'border-[#cfc4c5]/60 bg-white hover:border-black'
              }`}
            >
              <div className="flex-1">
                <p className="font-semibold text-black text-sm">Express Delivery</p>
                <p className="text-xs text-[#4c4546]">Next Business Day</p>
              </div>
              <span className="text-black font-bold text-sm">₹999</span>
              <div className="ml-4 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                {deliveryMethod === 'Express' && <div className="w-2.5 h-2.5 rounded-full bg-black"></div>}
              </div>
            </label>
          </div>
        </section>



        {/* Section 4: Final Order Summary */}
        <section className="space-y-[1.5rem] border-t border-[#cfc4c5]/30 pt-[1.5rem]">
          <h2 className="text-lg font-bold text-black uppercase tracking-wider font-display">Order Summary</h2>
          <div className="space-y-[1rem]">
            {items.map((item) => {
              const image = item.product.images?.[0] && !item.product.images[0].startsWith('/assets/') ? item.product.images[0] : null;
              return (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-[#f6f2f7] rounded-lg flex-shrink-0 overflow-hidden border border-[#cfc4c5]/15">
                    {image ? (
                      <img className="w-full h-full object-cover" src={image} alt={item.product.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="material-symbols-outlined text-4xl text-gray-400">smartphone</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <p className="font-semibold text-[#1b1b1e] text-sm">{item.product.title}</p>
                      <p className="text-xs text-[#4c4546]">
                        {item.selectedModel || item.product.deviceModels?.[0] || 'Universal'} / {item.selectedMaterial || item.product.materials?.[0] || 'Premium'}
                      </p>
                    </div>
                    <div className="flex justify-between items-end text-xs">
                      <span className="text-[#4c4546]">Qty: {item.quantity}</span>
                      <span className="font-bold text-black">₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="space-y-2 pt-4 border-t border-[#cfc4c5]/10 text-xs font-semibold">
              <div className="flex justify-between text-[#4c4546]">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4c4546]">
                <span>Shipping</span>
                <span className="text-[#4648d4] font-semibold">{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-[#4c4546]">
                <span>Tax</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1b1b1e] font-bold text-sm pt-2">
                <span>Total</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-xl border-t border-[#cfc4c5]/20 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            disabled={submitting}
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white py-4 rounded-lg font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-800 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                Processing...
              </>
            ) : (
              <>
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Place Order via WhatsApp
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
