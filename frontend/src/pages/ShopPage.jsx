import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const CATEGORY_IMAGES = {
  'iphone': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8cV1rW0d035f2splAeV1_xfaE_1ocy6ajORiQ7X9zifcKUAnR9l-KrMu7psRsZ5dSl4u_I8sK6Vjx4-beiaKL1hvxl57dHK7aHbJjfFFJpND6sdcNnVdvyPsfgNyg_aGwQdWsI5NI8TOeeJpodiAocIE1mRWCR9s4nDdQ7_QgPpb3jy2fO3TAlWiopO-vsaSWp2DNHPczkTGifYgC_B8lNojqswjJrYMpZqu1dkkwbQy0olQh4zuOmYe0M8MYQyX_TFqAdXkbNjb3',
  'samsung': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl-zaXdC9-apprcVv36xmG-K8VZ55IGkqtyrnP4q9r4K_s_gWGsl0LdCGKWlzzObEKripmZtLcpJ7aON3AzIfiE-JIg6uw2UpPd_lEdLifFpTsQzAksKoioSYlobDVGLm8H9zVHSBqeU1QE-JltRcSMSkCXCBcHnXy7p0iKPd02_LAA8HFSFgRvZkwAyXYWx61JxgJjP4PiyaZzr8roJGyxfR-EWrLmikV3B6Qrh8tlqaW9KKSRS_0WzQfulwlZ-qKyvX3RWy4fJ1r',
  'clear': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVZkwQ57GnNrpQYC81I7FkR-tDAHfZDI0vDOVXqSYf7xo3-iqg_bWI2MSZmTXGJXoLG24wvOJ_SnsxUSe2Kct66Uc-nQkIgWd0CqtP6nJaVtGGklmBLVLzAs54c1XrkFS6Pc_ecTZdk5q6uHX7pmXJ1mJrLC_4hVMb9yH2KmWbVBHYg5yE70U0OqXW2S8nMF4o9-dXONbWp7CDnlNQRW5jMSKSlcVchixCV7LZJXMNURjlDSyjwAA4rww02Bwznpw-M3HZeu9wOx1_',
  'artistic': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhOBQV3G-vJs-bLy-7rvz0ysdeBep2hqnWkgZcOwoi2v87ymHD7rLTT40uc0QQTJldRc_g78e80l8un_VEw4z0WGe0jGKvYvcy8QZZsU46f-7hwga4JOxXTgEiWPHsJR5w6haB4Ovaugww3zvHDWeN-tngxJYqLU9COkhJy_cOpJpoEuJ9jMj1KwTA1Df9gffxlr2Cc9EUJR7l7uHHQuXuJ92LVYCwfWvEngBeSF_zmMe7WnFQHQHwpQBYLrwpA7ly2-pYP15JfIM_'
};

export default function ShopPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { logout } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories')
        ]);
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load store catalog data.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) ||
                          product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesModel = !selectedModel || product.deviceModels?.includes(selectedModel);
    const matchesMaterial = !selectedMaterial || product.materials?.includes(selectedMaterial);

    return matchesSearch && matchesCategory && matchesModel && matchesMaterial;
  });

  const getCategoryImage = (cat) => {
    if (cat.image) return cat.image;
    const key = cat.name.toLowerCase();
    if (key.includes('iphone')) return CATEGORY_IMAGES.iphone;
    if (key.includes('samsung')) return CATEGORY_IMAGES.samsung;
    if (key.includes('clear')) return CATEGORY_IMAGES.clear;
    return CATEGORY_IMAGES.artistic;
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedModel(null);
    setSelectedMaterial(null);
    setSearch('');
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans min-h-screen overflow-x-hidden pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md z-50 flex justify-between items-center px-[1.25rem]">
        <button 
          onClick={() => setDrawerOpen(true)}
          className="hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-black text-2xl">menu</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-black font-display">CoverScart</h1>
        <button 
          onClick={() => navigate('/search')}
          className="hover:opacity-70 transition-opacity active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-black text-2xl">search</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-[1.25rem] max-w-7xl mx-auto">
        {/* Search & Filter Cluster */}
        <section className="mt-6 mb-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c4546]">search</span>
            <input
              className="w-full h-12 pl-12 pr-4 bg-[#f6f2f7] border-none rounded-full text-sm focus:ring-2 focus:ring-[#4648d4]/50 focus:outline-none placeholder-[#4c4546]/50"
              placeholder="Search phone cases..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-[1rem] mt-4 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={handleResetFilters}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                !selectedCategory && !selectedModel && !selectedMaterial && !search
                  ? 'bg-black text-white'
                  : 'bg-[#eae7eb] text-[#1b1b1e] border border-[#cfc4c5]/20 hover:bg-[#e4e1e6]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Reset Filters
            </button>
            {['iPhone 15', 'iPhone 15 Pro', 'Galaxy S24', 'Leather', 'Silicon', 'Glass'].map((filter) => {
              const isModel = filter.includes('iPhone') || filter.includes('Galaxy');
              const isSelected = isModel ? selectedModel === filter : selectedMaterial === filter;
              return (
                <button
                  key={filter}
                  onClick={() => {
                    if (isModel) {
                      setSelectedModel(selectedModel === filter ? null : filter);
                    } else {
                      setSelectedMaterial(selectedMaterial === filter ? null : filter);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border border-[#cfc4c5]/20 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#4648d4] text-white' : 'bg-[#eae7eb] text-[#1b1b1e] hover:bg-[#e4e1e6]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Category Horizontal Scroll */}
        <section className="mb-[2.5rem] overflow-x-auto no-scrollbar -mx-[1.25rem] px-[1.25rem]">
          <div className="flex gap-[1rem]">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`relative min-w-[140px] h-20 rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer transition-all ${
                    isSelected ? 'ring-4 ring-[#4648d4]' : 'border border-[#cfc4c5]/20'
                  }`}
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={getCategoryImage(cat)}
                    alt={cat.name}
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <span className="relative text-white font-semibold text-xs z-10">{cat.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#4648d4]">progress_activity</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#cfc4c5]/20 rounded-2xl p-6">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">find_in_page</span>
            <p className="text-[#4c4546] text-sm">No covers match your active filters.</p>
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-[1rem] mb-[2.5rem]">
            {filteredProducts.map((product) => {
              const isWishlisted = isInWishlist(product.id);
              const image = product.images?.[0] && !product.images[0].startsWith('/assets/') ? product.images[0] : null;

              return (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-white p-3 rounded-2xl border border-[#cfc4c5]/20 hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div>
                    <div className="aspect-[4/5] bg-[#f6f2f7] rounded-xl overflow-hidden relative mb-2">
                      {image ? (
                        <img
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          src={image}
                          alt={product.title}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="material-symbols-outlined text-4xl text-gray-400">smartphone</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-primary hover:bg-white transition-colors z-10"
                        aria-label="Add to Wishlist"
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{
                          fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
                          color: isWishlisted ? '#ba1a1a' : 'inherit'
                        }}>favorite</span>
                      </button>
                      <div className="absolute bottom-0 left-0 w-full p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="w-full py-2 bg-black text-white text-xs font-semibold rounded-lg shadow-lg cursor-pointer hover:bg-[#4648d4] transition-colors"
                        >
                          Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-semibold text-[#1b1b1e] line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-[#4c4546]">{product.deviceModels?.[0] || 'Universal'}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-bold text-[#4648d4]">₹{(product.salePrice || product.price).toLocaleString()}</p>
                    {product.salePrice && (
                      <p className="text-xs text-[#7e7576] line-through">₹{product.price.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col py-6 bg-white h-full w-80 rounded-r-xl shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 mb-8 flex justify-between items-center">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button className="material-symbols-outlined cursor-pointer" onClick={() => setDrawerOpen(false)}>close</button>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="text-sm font-medium">Home Storefront</span>
          </Link>
          <Link to="/shop" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 bg-[#e1e0ff] text-[#07006c] font-semibold rounded-lg mx-2">
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-sm">Shop Catalog</span>
          </Link>
          <Link to="/account" onClick={() => setDrawerOpen(false)} className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">My Account</span>
          </Link>
          <hr className="mx-6 my-4 border-[#cfc4c5]/30" />
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-6 py-3 text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Log Out</span>
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

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-white/95 border-t border-[#cfc4c5]/20 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/shop')} className="flex flex-col items-center justify-center text-[#4648d4] relative active-dot transition-all cursor-pointer">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Shop</span>
          <span className="absolute bottom-1 w-1 h-1 bg-[#4648d4] rounded-full" />
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Cart</span>
        </button>
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
