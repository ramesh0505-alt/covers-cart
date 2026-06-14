import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data } = await API.get('/orders');
        // Filter orders by active user ID
        const userOrders = data.filter(o => o.userId === user?.id);
        // Sort by date descending
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(userOrders);
      } catch (err) {
        console.error('Failed to load orders:', err);
        toast.error('Could not fetch your order history.');
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'DELIVERED':
        return (
          <span className="bg-secondary-container/10 text-[#4648d4] px-3 py-1 rounded-full font-semibold text-[10px] uppercase tracking-widest border border-[#4648d4]/20 font-display">
            Delivered
          </span>
        );
      case 'PROCESSING':
      case 'PENDING':
        return (
          <span className="bg-[#fbf8fc] text-[#1b1b1e] px-3 py-1 rounded-full font-semibold text-[10px] uppercase tracking-widest border border-[#cfc4c5]/40 flex items-center gap-1 font-display">
            <span className="w-1.5 h-1.5 bg-[#4648d4] rounded-full animate-pulse"></span>
            In Transit
          </span>
        );
      default:
        return (
          <span className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-semibold text-[10px] uppercase tracking-widest border border-neutral-300 font-display">
            {status || 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans min-h-screen flex flex-col pb-32">
      {/* Top AppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-black text-2xl">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display cursor-pointer" onClick={() => navigate('/')}>CoverScart</h1>
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

      {/* Main Content */}
      <main className="flex-grow pt-24 px-[1.25rem] max-w-2xl mx-auto w-full">
        {/* Breadcrumb / Header */}
        <div className="mb-[1.5rem]">
          <h2 className="text-2xl font-bold text-black font-display mb-1">Order History</h2>
          <p className="text-[#4c4546] text-xs font-semibold">Track your lifestyle upgrades and past purchases.</p>
        </div>

        {/* Order List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#4648d4]">progress_activity</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#cfc4c5]/25 rounded-2xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-[#cfc4c5] mb-4">inventory_2</span>
            <h3 className="text-base font-bold text-black mb-1">No orders yet</h3>
            <p className="text-xs text-[#4c4546] mb-6">Upgrade your gear by checking out our latest products.</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-[1rem]">
            {orders.map((order) => {
              const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              return (
                <div
                  key={order.id}
                  onClick={() => toast.success(`Viewing details for order #${order.id.slice(-8).toUpperCase()}`)}
                  className="bg-white rounded-xl p-[1rem] border border-[#cfc4c5]/20 flex flex-col gap-[1rem] cursor-pointer hover:border-[#4648d4]/30 hover:shadow-sm transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-[#4c4546] uppercase tracking-wider mb-1">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-base font-bold text-black font-display">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Thumbnail Row */}
                  <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {order.items?.map((item) => {
                      const image = item.product?.images?.[0] && !item.product.images[0].startsWith('/assets/') ? item.product.images[0] : null;
                      return (
                        <div
                          key={item.id}
                          className="w-16 h-16 bg-[#f6f2f7] rounded-lg overflow-hidden flex-shrink-0 border border-[#cfc4c5]/10"
                        >
                          {image ? (
                            <img className="w-full h-full object-cover" src={image} alt="Ordered Item" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="material-symbols-outlined text-2xl text-gray-400">smartphone</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center pt-[0.5rem] border-t border-[#cfc4c5]/10">
                    <p className="text-xs text-[#4c4546] font-semibold">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-base font-bold text-black font-display">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-[2.5rem] p-[1rem] bg-[#4648d4]/5 rounded-xl border border-[#4648d4]/10 text-center">
          <p className="text-xs text-[#4c4546] font-semibold mb-3">Questions about an order?</p>
          <button
            onClick={() => toast('Support portal is coming in next phase!')}
            className="bg-white text-black border border-black px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-[#eae7eb] transition-colors w-full cursor-pointer"
          >
            Contact Support
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
