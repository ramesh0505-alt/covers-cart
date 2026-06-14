import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [query, setQuery]       = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await API.get('/products');
      const filtered = data.filter(
        (p) =>
          p.title?.toLowerCase().includes(q.toLowerCase()) ||
          p.description?.toLowerCase().includes(q.toLowerCase()) ||
          p.deviceModels?.some((m) => m.toLowerCase().includes(q.toLowerCase()))
      );
      setProducts(filtered);
    } catch {
      toast.error('Search failed. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when landing with ?q=
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (searchParams.get('q')) doSearch(searchParams.get('q'));
  }, [searchParams, doSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    doSearch(query);
  };

  return (
    <div className="min-h-screen bg-[#fbf8fc] overflow-x-hidden pb-32">
      <Header />

      <main className="pt-20 px-4 max-w-2xl mx-auto">
        {/* Search input */}
        <form onSubmit={handleSubmit} className="mt-6 mb-8">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c4546]">
              search
            </span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cases, models, materials…"
              className="w-full h-14 pl-12 pr-16 bg-white border border-[#cfc4c5]/50 rounded-2xl text-sm focus:ring-2 focus:ring-[#4648d4]/40 focus:border-[#4648d4] focus:outline-none shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setProducts([]); setSearched(false); }}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-[#4c4546] hover:text-[#111] transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#111] text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4648d4] transition-colors active:scale-95"
            >
              Go
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#4648d4]">progress_activity</span>
          </div>
        )}

        {/* Empty state — before any search */}
        {!loading && !searched && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-[#cfc4c5] mb-4 block">search</span>
            <p className="text-sm font-semibold text-[#4c4546]">Search for phone cases, models, or materials</p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['iPhone 15', 'Galaxy S24', 'Leather', 'Clear', 'Dragon'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); doSearch(s); setSearchParams({ q: s }); }}
                  className="px-4 py-2 bg-[#f0edf1] text-[#4c4546] rounded-full text-xs font-bold hover:bg-[#e4e1e6] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && searched && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#cfc4c5]/20 p-8">
            <span className="material-symbols-outlined text-5xl text-[#cfc4c5] mb-4 block">find_in_page</span>
            <p className="text-sm font-semibold text-[#4c4546] mb-2">No results for "{query}"</p>
            <p className="text-xs text-[#4c4546]">Try different keywords or browse the full catalogue</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-6 bg-[#111] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4648d4] transition-colors"
            >
              Browse All Cases
            </button>
          </div>
        )}

        {/* Results grid */}
        {!loading && products.length > 0 && (
          <>
            <p className="text-xs font-bold text-[#4c4546] uppercase tracking-widest mb-4">
              {products.length} result{products.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => {
                const image = product.images?.[0] && !product.images[0].startsWith('/assets/') ? product.images[0] : null;
                const wishlisted = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#cfc4c5]/20 p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="relative aspect-[4/5] bg-[#f6f2f7] rounded-xl overflow-hidden mb-3">
                      {image ? (
                        <img
                          src={image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-4xl text-[#cfc4c5]">smartphone</span>
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{
                            color: wishlisted ? '#ba1a1a' : '#111',
                            fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-[#111] line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-[#4c4546] mb-2">{product.deviceModels?.[0] || 'Universal'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#4648d4]">
                        ₹{(product.salePrice || product.price).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="text-[10px] font-black bg-[#111] text-white px-3 py-1.5 rounded-lg hover:bg-[#4648d4] transition-colors active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <BottomNav />
      <div className="h-16" />
    </div>
  );
}
