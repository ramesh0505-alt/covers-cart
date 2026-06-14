import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav';
import { useCart } from '../context/CartContext';
import API from '../lib/api';
import toast from 'react-hot-toast';


export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // API state
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const prodRes = await API.get('/products');
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Homepage data fetch error:', err);
        setError('Failed to load some content. Please refresh.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAll();
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isAdded = !prev[productId];
      toast(isAdded ? 'Added to wishlist!' : 'Removed from wishlist', {
        icon: isAdded ? '❤️' : '💔',
      });
      return { ...prev, [productId]: isAdded };
    });
  };

  return (
    <div className="overflow-x-hidden bg-[#fbf8fc] text-[#1b1b1e]">
      <Header />

      <main className="pb-16">
        {/* BEGIN: HeroSection */}
        <section 
          className="relative h-[60vh] flex items-center justify-center text-center text-white px-6" 
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuABkPRHbBL5F2DaAo3DObJfd36KWCfrKE3BoyjgA5FROUXbfiHJUTtCc3bXsORhB7xMCndACXstzbLD7Ogn-7tGCkhAL3-yNfdMtdZigcVa9E4kbxZbkD23fqRgLl_7Cnj6oEiiZNPZWWJvi70EBwHyMOkohireIAgD_rrWfDoTMUgqKMPQnlBoKeU0VP6MOE-zjAd0yRwvfbjmvi49iKIkDkdfHJgK7IFzqws0iluq-yTPTOVKblpwrmt-fCB6B6Hq7NBhGyhQto1z')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="max-w-xs">
            <h1 className="text-4xl font-bold mb-1 font-headline">Designer Printed</h1>
            <h2 className="text-4xl font-bold text-[#4648d4] mb-4 font-headline">Mobile Covers</h2>
            <p className="text-sm opacity-90 mb-8 leading-relaxed">
              Premium glass cases, soft armor, and custom covers — all starting at just ₹299. Find your perfect fit, ship it fast.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => navigate('/shop')}
                className="bg-[#4648d4] text-white px-6 py-3 rounded-lg font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Shop Now
              </button>
              <button 
                onClick={() => navigate('/customize')}
                className="border border-white text-white px-6 py-3 rounded-lg font-bold text-xs tracking-widest uppercase bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
              >
                Customize
              </button>
            </div>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: FeaturedShowcase */}
        <section className="bg-white py-8 overflow-hidden" data-purpose="premium-showcase">
          <div className="px-6 mb-8 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black tracking-[0.2em] text-[#4648d4] uppercase mb-1 block">Curated Selection</span>
              <h3 className="text-2xl font-black tracking-tighter text-[#111111] font-headline">PREMIUM SHOWCASE</h3>
            </div>
            <button
              onClick={() => navigate('/limited')}
              className="text-xs font-bold text-[#4648d4] underline decoration-2 underline-offset-4 uppercase tracking-wider hover:text-black transition-colors"
            >
              View Limited →
            </button>
          </div>
          <div className="overflow-hidden py-4">
            <div className="flex gap-6 animate-[marquee-slow_40s_linear_infinite] w-max">
              {/* Duplicate set for infinite loop effect */}
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex gap-6">
                  {/* Oatmeal Leather */}
                  <div className="flex-shrink-0 w-[300px]">
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#e5e5e5] group">
                      <img 
                        alt="Oatmeal Leather" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLvj-LucaIuEb-vddowkRY6xBlz3ujGPrr6Ec4tAO5MCNEAivH_qzyAjI1jCR1Lybe-Q3z33OJjeIzb7F1fswXopGqTVb0YZb1x-AYzqLv-W-X91g-Sgi9KIzGUFZyhBIZ1Nd-RTZd6ECHGOYsvZFj_4O2nMWd092lP42VaVd0MTiCs3AYN0WsfM8bwZeO1lWVsoI22clT2E4RTfJWkkxZ5ACz38XYCXk8dHLSZnvnG0-RRJEWlnP7z_I_Y"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
                          <p className="text-[10px] font-bold text-[#4648d4] uppercase tracking-widest mb-1">Limited Edition</p>
                          <h4 className="text-white font-bold text-lg font-headline">Oatmeal Leather</h4>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-white font-black">₹1,499</span>
                            <button 
                              onClick={() => navigate('/limited')}
                              className="bg-white text-[#111111] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter hover:bg-gray-100 transition-colors"
                            >
                              View Limited
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MagSafe Crystal */}
                  <div className="flex-shrink-0 w-[300px]">
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-[#e5e5e5] group">
                      <img 
                        alt="MagSafe Crystal" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLvKFbLs-oWu8G4j3AP2m67DFFOZkoFN_74-vEBaj7tuc8YqGAkl7BKODdr06n7iMrlsQRwfctPqWCx0Csnel0WDFuPAE-R4P7lrvISCx-sr5EdoEiqhBDVW7Ued0JB6sjMIS28EkDNFwQiI9l8edNmGdQnHK_0X9RXeOUiaM-pnLa552SyjAh9l_qrTX-Q2pZWagFc7MBD91Enhwi25ebIb8g4EOMeFoOmq6VgWyPz_T1C0FGDm1iiMfjA"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4">
                          <p className="text-[10px] font-bold text-[#4648d4] uppercase tracking-widest mb-1">Best Seller</p>
                          <h4 className="text-white font-bold text-lg font-headline">MagSafe Crystal</h4>
                          <div className="flex justify-between items-center mt-3">
                            <span className="text-white font-black">₹999</span>
                            <button 
                              onClick={() => navigate('/shop?q=magsafe')}
                              className="bg-white text-[#111111] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter hover:bg-gray-100 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* END: FeaturedShowcase */}

        {/* BEGIN: BrowseByStyle */}
        <section className="py-12 bg-[#f8f8f8] rounded-t-[40px] border-t border-[#e5e5e5]">
          <div className="px-6 flex justify-between items-end mb-6">
            <h3 className="text-2xl font-bold text-[#111111] font-headline">Browse by Style</h3>
            <button 
              onClick={() => navigate('/shop')}
              className="text-xs font-bold text-gray-400 underline decoration-2 underline-offset-4 uppercase tracking-wider hover:text-black transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex gap-4 px-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            <div 
              onClick={() => navigate('/shop?style=anime')}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group flex-shrink-0 w-[280px] snap-start cursor-pointer"
            >
              <img 
                alt="Anime/Action" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzm2oS5liYO_O_FbVEIVvBVDSc8XC0RKO5Cdnp7kNK0PHjmLuwtDaMdYe78xjDOC9iowMQcbf-g1jTbPtJD2SB3k5KqNaItaTqLzh3Q0cNxvz4JJcixp6SfCmuHBF6HX6sCXabYyuI2wdanc3C_WidNplJ5Dh9rWRoRKEccgbCDu6ZRwCBjgUpQ2TVML3OA3UuRd4tRVWVC3Mq85WL9-6KEh615zhYrD3vm2V0i2aTRh63uoaYaNmzoO2onkVzwTsj35Bb64AbuB7A"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Pop-Culture</span>
                <h4 className="text-white font-bold text-lg leading-tight font-headline">Anime/Action</h4>
              </div>
            </div>
            <div 
              onClick={() => navigate('/shop?style=tech')}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group flex-shrink-0 w-[280px] snap-start cursor-pointer"
            >
              <img 
                alt="Tech Designs" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYu-CpDB47bAgdT7Yq3mSiP-Q5hYNnc8c2eKUgxKr_XTOPRHG6rO_I8E1hCgzDN9M53J3Kh6QHf-Au2ecXQom_fZ1oLsNyvvLAD_MuOa9suqVXQKRhLEgQ6XyY75_vji7g_MHQJKbOzlp_5qBw5YjGbEd_O_d-2XIgmW-Z9191XTkw1v2MR17FjbD2stXU3JfwIli2yMawtW41GeaUR3OcZWDLQHzz9Jw6gaC9jDOB6gGLcN83M3G5NPNy1OoAmr9MqtLNrnKGuxxL"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] text-gray-300 font-semibold uppercase">Minimalist</span>
                <h4 className="text-white font-bold text-lg leading-tight font-headline">Tech Designs</h4>
              </div>
            </div>
          </div>
        </section>
        {/* END: BrowseByStyle */}

        {/* BEGIN: NewArrivals */}
        <section className="py-12 bg-white px-4">
          <h3 className="text-2xl font-bold mb-8 font-headline">New Arrival</h3>
          <div className="space-y-6">
            <div className="flex h-44 bg-[#f8f8f8] rounded-xl overflow-hidden border border-[#e5e5e5]">
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400">ArmorPad Cases</span>
                  <h4 className="text-xl font-bold mt-1 leading-tight text-[#111111] font-headline">ArmorPad Cases</h4>
                </div>
                <button 
                  onClick={() => navigate('/shop?q=armor')}
                  className="bg-[#4648d4] text-white text-[10px] font-bold py-2 px-4 rounded-lg w-max uppercase hover:bg-[#4648d4]/90"
                >
                  Shop Now
                </button>
              </div>
              <div className="w-2/5 relative">
                <img 
                  alt="Armor" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnPOyYa0R1dK2RC775216YAFnLqINs-6RI6cATcUjDCSYFXF-yAZlBePQX25p-wRag8KOM03lljH7nvHwjlHF_zivYM2IlwfEl5jn9iTVFpG1iJTc7a5jDj0fO1_t8aoZ3ygfi45RkuaGYZdrXG1VSHvswr3dQn_nLWct4VZnPAoRL47A0Vr1_qUbH_xwwMcs-vO-Uv96RuB2yqQE1FeXUyulVA8eD72MmhXHcrk3ML4fnrH5IF4bvEN-urTjLAWAqx77F1DyGLGXH"
                />
                <div className="absolute top-0 right-0 h-full w-8 bg-[#4648d4]/10 flex items-center justify-center border-l border-[#e5e5e5]">
                  <span className="rotate-90 whitespace-nowrap text-[8px] font-black tracking-widest text-[#4648d4]">NEW ARRIVAL</span>
                </div>
              </div>
            </div>

            <div className="flex h-44 bg-[#f8f8f8] rounded-xl overflow-hidden border border-[#e5e5e5]">
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400">MagSafe Cases</span>
                  <h4 className="text-xl font-bold mt-1 text-[#111111] font-headline">MagSafe Cases</h4>
                </div>
                <button 
                  onClick={() => navigate('/shop?q=magsafe')}
                  className="bg-[#4648d4] text-white text-[10px] font-bold py-2 px-4 rounded-lg w-max uppercase hover:bg-[#4648d4]/90"
                >
                  Shop Now
                </button>
              </div>
              <div className="w-2/5 bg-white flex items-center justify-center relative border-l border-[#e5e5e5]">
                <img 
                  alt="MagSafe Case" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkm9AqAx6tKSGlG_2ycom81Gjv-IElH3-Rl3sFpVO_DdE6Mmcf84FHSdf7e5FLdPp2gmtc4YlvEF7kWMeQQaezek89uqucgJfOjvE4aOmqWTlsniKqQVIsjDw1FDv-I-F2Qna7OvnB55e7xDZqstPVIDX8Hd_L_2eDWp-gjMo7lw_LK7eypQ7Np1oEvmJT8kFvUhPXNqDdA_fuAvF7-U5-YtFmq_0MOYgayvD8O3uMkNeYw7A1bDB5LAMM21iDl24j22TwffgzXDDD"
                />
                <div className="absolute top-0 right-0 h-full w-8 bg-[#4648d4]/10 flex items-center justify-center border-l border-[#e5e5e5]">
                  <span className="rotate-90 whitespace-nowrap text-[8px] font-black tracking-widest text-[#4648d4]">NEW ARRIVAL</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: NewArrivals */}

        {/* BEGIN: MysteryPouch */}
        <section className="px-4 py-8">
          <div 
            onClick={() => navigate('/mystery-drop')}
            className="relative rounded-[32px] overflow-hidden bg-[#111111] aspect-[16/9] flex flex-col items-center justify-center text-center p-6 text-white border-2 border-[#4648d4]/30 cursor-pointer group"
          >
            <div className="absolute inset-0 opacity-40">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_-3NPm6IjV56qZYkrI7igi0aQrseamJ5z6lIbjxIsQyjPl1E0-guDEUSQT79hPSBAZ0tiPVYxwhidPk71DVqqX7NG4PUtBOlA_i_68VD1xuMtE9mdQhzaX1Yzu0wh5S6nhGwekHgt5tAzTdekUu8b6pYcb317AQF3T_Kr-gTPE4aRl40gp0RX9vzqXbMfIRO9N57rtaoFJg05mPNOEG9Za-dyBmnYaqj3aJNVRfuaOGu6ngGTHShm2wHl90kbLCHjJ-hRToH_03icHcQ"
                alt="Mystery Pouch Background"
              />
            </div>
            <div className="relative z-10">
              <span className="bg-[#4648d4] text-white px-3 py-1 text-[10px] font-black rounded-lg mb-4 inline-block uppercase tracking-wider">Exclusive</span>
              <h3 className="text-3xl font-black mb-2 tracking-tighter font-headline">THE MYSTERY POUCH</h3>
              <p className="text-xs font-medium opacity-80 mb-6">Unlock a surprise designer case for just ₹299</p>
              <div className="w-12 h-1 bg-[#4648d4] mx-auto rounded-full"></div>
            </div>
          </div>
        </section>
        {/* END: MysteryPouch */}

        {/* BEGIN: OurPicks */}
        <section className="py-12 bg-white">
          <div className="px-4 flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-[#111111] font-headline">Our Picks</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-gray-400 hover:text-[#4648d4] hover:border-[#4648d4] transition-colors">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-gray-400 hover:text-[#4648d4] hover:border-[#4648d4] transition-colors">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto px-4 hide-scrollbar">
            {loadingProducts ? (
              <div className="text-sm text-gray-500 px-4">Loading dynamic recommendations...</div>
            ) : (
              products.map((product) => {
                const isWishlisted = !!wishlist[product.id];
                const image = product.images?.[0] && !product.images[0].startsWith('/assets/') ? product.images[0] : null;

                return (
                  <div key={product.id} className="flex-shrink-0 w-48">
                    <div className="bg-[#f8f8f8] rounded-xl p-4 relative aspect-square flex items-center justify-center mb-4 border border-[#e5e5e5]">
                      <button 
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10"
                        aria-label="Add to Wishlist"
                      >
                        <i className={`${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart`}></i>
                      </button>
                      <div 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="w-3/4 aspect-square rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                      >
                        {image ? (
                          <img alt={product.title} className="w-full h-full object-cover" src={image} />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border-4 border-gray-700">
                            <div className="w-1/2 h-1/2 rounded-full border-2 border-gray-700 flex items-center justify-center">
                              <div className="w-full h-0.5 bg-gray-700 rotate-45"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <h5 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-xs font-bold truncate text-[#111111] cursor-pointer hover:text-[#4648d4] transition-colors"
                    >
                      {product.title}
                    </h5>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs font-black text-[#4648d4]">₹{product.price}</span>
                      {product.salePrice && (
                        <span className="text-[10px] text-gray-400 line-through">₹{product.salePrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-2 w-full bg-black text-white text-[10px] font-bold py-2 rounded-lg uppercase tracking-wide hover:bg-[#4648d4] transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>
        {/* END: OurPicks */}

        {/* BEGIN: CommunityGallery */}
        <section className="py-12 bg-[#f8f8f8] border-y border-[#e5e5e5]">
          <div className="px-6 text-center mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Join the conversation</span>
            <h3 className="text-2xl font-black mt-2 text-[#111111] font-headline">#COVERSCART COMMUNITY</h3>
          </div>
          <div className="flex gap-2 px-4">
            <div className="w-1/2 aspect-square bg-gray-200 overflow-hidden border border-[#e5e5e5] rounded-lg">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfhEbW32mWYLXzv8uhbaiTs_fHlMqr2APvwmvZ3QTmBtenbolkeLxU56ABAMVS5rddYt6lpDF2iY-jb-W6UB0XmA8uIeXWp-3F5lPQCdmaPjFd8FSIQ-okxfs2gYIS6-2uadST56ES-FVxAsk8JIJeFdj4-4Kt1uggAhSvMNRHoL5Ym7V0U2EaQtqWzL7rDRtaWaLTXYzbkeYnhfOqQnqBLLAHwdA9ohtE9usJI1j-LOqkEGVBpkmMIkmitvfadRmrNgBVfZaCyd8p"
                alt="Community Post 1"
              />
            </div>
            <div className="w-1/2 aspect-square bg-gray-200 overflow-hidden border border-[#e5e5e5] rounded-lg">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLFUNLpdyfVL8uos2EdmHmyIFd3mXbMI7ahGjZz2yDB7BCzj63_4sxCi8VgsuYp0ytjj3nIBls4FHpY0-17JPkYZ-ba2uAIZZbvLZ3W0icUb9_mNHGcqve6eGhsydv_T-sOq-dNtYX7V1RoG8-rJYI0Px5dmCe8wI9czaJXXbYJaIn9ALWfMk0MygLCkUlwyyl3d8zroJPEoj7rxymK68SeFbofLIFSi6ziBWUblBFBaIG2Jhnnqf-sZ6YSMnjzyKBJ96GhQOxy4_B"
                alt="Community Post 2"
              />
            </div>
          </div>
          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/community')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4648d4] uppercase tracking-widest hover:underline"
            >
              View Gallery Experience <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </section>
        {/* END: CommunityGallery */}

        {/* BEGIN: Newsletter */}
        <section className="py-20 px-6 text-center bg-white">
          <h3 className="text-2xl font-bold mb-2 text-[#111111] font-headline">Join our newsletter</h3>
          <p className="text-sm text-gray-500 mb-8">Get updates on new arrivals and exclusive offers.</p>
          <div className="max-w-md mx-auto space-y-4">
            <input 
              className="w-full border border-[#e5e5e5] rounded-xl py-4 px-6 text-sm focus:ring-[#4648d4] focus:border-[#4648d4] bg-[#f8f8f8] outline-none" 
              placeholder="Email address" 
              type="email"
            />
            <button 
              onClick={() => toast.success('Thank you for subscribing!')}
              className="w-full bg-[#111111] text-white font-bold py-4 rounded-xl tracking-widest uppercase text-xs hover:bg-[#4648d4] transition-colors"
            >
              Subscribe
            </button>
          </div>
        </section>
        {/* END: Newsletter */}

        {error && (
          <div className="mx-4 mt-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm text-center">
            {error}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
      <div className="h-16" />

      {/* Marquee animation keyframe styles */}
      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
