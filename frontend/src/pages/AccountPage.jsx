import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await API.get('/orders');
        // Filter orders by active user ID
        const userOrders = data.filter(o => o.userId === user?.id);
        setOrderCount(userOrders.length);
      } catch (err) {
        console.error('Failed to load order count:', err);
      }
    }
    if (user?.id) fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Logout failed.');
    }
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans antialiased min-h-screen pb-32">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => toast.success('Drawer menu under development')}
            className="material-symbols-outlined text-black text-2xl hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer"
          >
            menu
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display">CoverScart</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/search')}
            className="material-symbols-outlined text-black text-2xl hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer"
          >
            search
          </button>
        </div>
      </header>

      <main className="pt-24 px-[1.25rem] max-w-lg mx-auto">
        {/* User Profile Header */}
        <section className="flex flex-col items-center mb-[2.5rem]">
          <div className="relative w-24 h-24 mb-[1rem]">
            {user?.avatarUrl ? (
              <img 
                alt="User Profile" 
                className="w-full h-full object-cover rounded-full border-2 border-black/10" 
                src={user.avatarUrl} 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#e1e0ff] flex items-center justify-center font-bold text-[#07006c] text-3xl font-display uppercase">
                {user?.name?.[0] || user?.email?.[0]}
              </div>
            )}
            <button 
              onClick={() => toast('Edit avatar feature coming soon!')}
              className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full shadow-lg border-2 border-white hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-white flex items-center justify-center">edit</span>
            </button>
          </div>
          <h2 className="text-lg font-bold text-black font-display">{user?.name || 'Alexandria Sterling'}</h2>
          <p className="text-xs text-[#4c4546] font-semibold mt-1">{user?.email || 'alexandria.s@premiummail.com'}</p>
        </section>

        {/* Stats Grid (Subtle Bento Style) */}
        <div className="grid grid-cols-3 gap-[1rem] mb-[2.5rem]">
          <div className="bg-[#f6f2f7] p-[1rem] rounded-xl text-center flex flex-col items-center justify-center border border-[#cfc4c5]/20">
            <span className="text-lg font-bold text-black font-headline">{orderCount}</span>
            <span className="text-[9px] font-bold text-[#4c4546] uppercase tracking-widest mt-1">Orders</span>
          </div>
          <div className="bg-[#f6f2f7] p-[1rem] rounded-xl text-center flex flex-col items-center justify-center border border-[#cfc4c5]/20">
            <span className="text-lg font-bold text-black font-headline">24</span>
            <span className="text-[9px] font-bold text-[#4c4546] uppercase tracking-widest mt-1">Saved</span>
          </div>
          <div className="bg-[#f6f2f7] p-[1rem] rounded-xl text-center flex flex-col items-center justify-center border border-[#cfc4c5]/20">
            <span className="text-lg font-bold text-black font-headline">02</span>
            <span className="text-[9px] font-bold text-[#4c4546] uppercase tracking-widest mt-1">Addresses</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-[0.5rem]">
          <Link 
            to="/orders"
            className="group flex items-center justify-between p-[1rem] bg-white border border-[#cfc4c5]/30 rounded-xl hover:bg-[#f6f2f7] transition-all duration-200 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#eae7eb] rounded-lg text-black">
                <span className="material-symbols-outlined text-xl">inventory_2</span>
              </div>
              <span className="font-semibold text-sm text-[#1b1b1e]">Order History</span>
            </div>
            <span className="material-symbols-outlined text-[#4c4546] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <Link 
            to="/wishlist"
            className="group flex items-center justify-between p-[1rem] bg-white border border-[#cfc4c5]/30 rounded-xl hover:bg-[#f6f2f7] transition-all duration-200 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#eae7eb] rounded-lg text-black">
                <span className="material-symbols-outlined text-xl">favorite</span>
              </div>
              <span className="font-semibold text-sm text-[#1b1b1e]">Wishlist</span>
            </div>
            <span className="material-symbols-outlined text-[#4c4546] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </Link>

          <button 
            onClick={() => toast('Address management features coming in next phase!')}
            className="w-full text-left group flex items-center justify-between p-[1rem] bg-white border border-[#cfc4c5]/30 rounded-xl hover:bg-[#f6f2f7] transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#eae7eb] rounded-lg text-black">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <span className="font-semibold text-sm text-[#1b1b1e]">Saved Addresses</span>
            </div>
            <span className="material-symbols-outlined text-[#4c4546] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>

          <button 
            onClick={() => toast('Support portal coming in next phase!')}
            className="w-full text-left group flex items-center justify-between p-[1rem] bg-white border border-[#cfc4c5]/30 rounded-xl hover:bg-[#f6f2f7] transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-[#eae7eb] rounded-lg text-black">
                <span className="material-symbols-outlined text-xl">help_outline</span>
              </div>
              <span className="font-semibold text-sm text-[#1b1b1e]">Support</span>
            </div>
            <span className="material-symbols-outlined text-[#4c4546] group-hover:translate-x-1 transition-transform">chevron_right</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-[#cfc4c5]/20 my-[1rem]"></div>

          <button 
            onClick={handleLogout}
            className="w-full text-left group flex items-center justify-between p-[1rem] bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-red-100/50 rounded-lg text-red-600">
                <span className="material-symbols-outlined text-xl">logout</span>
              </div>
              <span className="font-semibold text-sm text-red-600">Logout</span>
            </div>
          </button>
        </nav>

        {/* Subscription Promo (Extra Value) */}
        <div className="mt-[2.5rem] p-[1.5rem] bg-black rounded-2xl text-white relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em] mb-2">Member Benefit</p>
            <h3 className="text-lg font-bold mb-2 leading-tight font-display">Join CoverPlus+</h3>
            <p className="text-xs text-white/80 mb-4">Get 20% off all iPhone 15 &amp; Samsung S24 cases.</p>
            <button 
              onClick={() => toast.success('CoverPlus+ Subscription setup is coming soon!')}
              className="bg-white text-black font-semibold text-xs px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Join Now
            </button>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4648d4]/30 rounded-full blur-3xl"></div>
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
        {/* Active State: Profile */}
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4648d4] relative transition-transform cursor-pointer">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
          <span className="absolute bottom-1 w-1 h-1 bg-[#4648d4] rounded-full" />
        </button>
      </nav>
    </div>
  );
}
