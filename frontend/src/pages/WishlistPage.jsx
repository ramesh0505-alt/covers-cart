import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { wishlistItems, loading: wishlistLoading, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch suggested products for "You might also like"
  useEffect(() => {
    async function loadSuggestions() {
      try {
        const { data } = await API.get('/products');
        // Exclude products that are already in the wishlist
        const wishlistIds = new Set(wishlistItems.map(item => item.product_id));
        const filtered = data.filter(p => !wishlistIds.has(p.id));
        setSuggestedProducts(filtered.slice(0, 6));
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }
    loadSuggestions();
  }, [wishlistItems]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`Added ${product.title} to cart!`);
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans overflow-x-hidden min-h-screen pb-32 selection:bg-[#e1e0ff] selection:text-[#07006c]">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDrawerOpen(true)}
            className="material-symbols-outlined text-black text-2xl hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer"
          >
            menu
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display cursor-pointer" onClick={() => navigate('/')}>CoverScart</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/shop')}
            className="material-symbols-outlined text-black text-2xl hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer"
          >
            search
          </button>
        </div>
      </header>

      {/* Content Canvas */}
      <main className="pt-24 pb-32 px-[1.25rem] max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-[1.5rem] flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-black font-display">Wishlist</h2>
            <p className="text-xs text-[#4c4546] font-medium mt-1">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved to your collection
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-xs font-semibold text-[#4648d4] hover:underline transition-all cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlistLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#4648d4]">progress_activity</span>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#cfc4c5]/20 rounded-2xl p-6 text-center shadow-sm">
            <span className="material-symbols-outlined text-5xl text-[#cfc4c5] mb-4">favorite_border</span>
            <h3 className="text-base font-bold text-black mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-[#4c4546] mb-6">Browse our store catalog to find your next favorite phone cover!</p>
            <Link 
              to="/shop" 
              className="px-6 py-2.5 bg-black text-white text-xs font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Shop Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1rem]">
            {wishlistItems.map((item) => {
              const product = item.product;
              const inStock = product.stock > 0;
              const isLowStock = product.stock > 0 && product.stock <= 5;
              const image = product.images?.[0] && !product.images[0].startsWith('/assets/') ? product.images[0] : null;

              return (
                <div key={item.id} className="group flex flex-col gap-[0.5rem] bg-white p-3 rounded-2xl border border-[#cfc4c5]/25 hover:shadow-md transition-shadow relative">
                  <div 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="relative aspect-[3/4] bg-[#F8F8F8] rounded-xl overflow-hidden border border-[#cfc4c5]/10 cursor-pointer"
                  >
                    {image ? (
                      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={image} alt={product.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="material-symbols-outlined text-4xl text-gray-400">smartphone</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 z-10">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      {inStock ? (
                        isLowStock ? (
                          <span className="bg-[#ffdad6] text-[#93000a] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Low Stock
                          </span>
                        ) : (
                          <span className="bg-[#e1e0ff] text-[#07006c] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            In Stock
                          </span>
                        )
                      ) : (
                        <span className="bg-[#cfc4c5] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 px-1">
                    <h3 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-sm font-semibold text-black truncate cursor-pointer hover:text-[#4648d4] font-display"
                    >
                      {product.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-[#4c4546]">
                      {product.deviceModels?.[0] || 'Universal Case'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-bold text-black font-headline">
                        ₹{(product.salePrice || product.price).toLocaleString()}
                      </span>
                      {inStock ? (
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button 
                          disabled 
                          className="bg-[#cfc4c5]/40 text-[#4c4546]/50 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Suggested Items Section */}
        <section className="mt-[2.5rem] pt-6 border-t border-[#cfc4c5]/20">
          <h3 className="text-lg font-bold text-black font-display mb-4">You might also like</h3>
          {loadingSuggestions ? (
            <div className="flex justify-center items-center py-10">
              <span className="material-symbols-outlined animate-spin text-2xl text-[#4648d4]">progress_activity</span>
            </div>
          ) : suggestedProducts.length === 0 ? (
            <p className="text-xs text-[#4c4546]">No recommendations at this time.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {suggestedProducts.map((product) => {
                const image = product.images?.[0] && !product.images[0].startsWith('/assets/') ? product.images[0] : null;
                return (
                  <div 
                    key={product.id} 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="min-w-[150px] max-w-[150px] flex flex-col gap-2 cursor-pointer group"
                  >
                    <div className="aspect-square rounded-xl bg-[#f6f2f7] overflow-hidden relative border border-[#cfc4c5]/10">
                      {image ? (
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={image} alt={product.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="material-symbols-outlined text-4xl text-gray-400">smartphone</span>
                        </div>
                      )}
                    </div>
                    <div className="px-1">
                      <p className="text-xs font-semibold text-black truncate group-hover:text-[#4648d4]">{product.title}</p>
                      <p className="text-[11px] font-bold text-[#4648d4] mt-0.5">₹{(product.salePrice || product.price).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col py-6 bg-white h-full w-80 rounded-r-xl shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 mb-8 flex justify-between items-center">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button className="material-symbols-outlined cursor-pointer" onClick={() => setDrawerOpen(false)}>
            close
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="text-sm font-medium">Home Storefront</span>
          </Link>
          <Link to="/shop" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-sm font-medium">Shop Catalog</span>
          </Link>
          <Link to="/account" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">My Account</span>
          </Link>
          <Link to="/wishlist" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 bg-[#e1e0ff] text-[#07006c] font-semibold rounded-lg mx-2">
            <span className="material-symbols-outlined">favorite</span>
            <span className="text-sm">Wishlist</span>
          </Link>
          <hr className="mx-6 my-4 border-[#cfc4c5]/30" />
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-6 py-3 text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer text-left font-medium"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Log Out</span>
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
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
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-[#4648d4] transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
