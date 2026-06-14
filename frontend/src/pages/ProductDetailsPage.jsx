import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../lib/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const COMPLETE_LOOK_ITEMS = [
  {
    title: 'Glass Guard Pro',
    price: 1299,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLwZ6zFnMd6k8FauMfvP2wDUqY80UvW10EBhxuOc0yE9cTuPLVlE34WYrccxwFuwcsLllVgVjMqCBGKDE0_qzvniXINtcr19OCHJ_p8M08-qjxTBEoZRUSdB3EOXpOZFCPSZdUMvUKn_VVcL_tLbLSbXzLBiqLXzd7oTJq-NVbd1jaZHEuYBkkqIu9mI6f8x38g36OxjKzh8ah2FIbQQROi_jRYKG4ekpnm5VZ1KheHEozVa9rlAA3uzMaHVXtDMTf-xUjf8JBQGOx'
  },
  {
    title: 'Volt Magnetic Pad',
    price: 2499,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAebX7z-MWzpK8fLb8WPyBJ_BinA0EsQD4T9R8yKiFZAcC6CJzCgNOvtmTfhnA_WtbMF6yzlhGFMNdfPREW26yIQkbk0pqozbdkUjMyBQY68Yw85KMjcBjYUm-3dc9djW4iiDleRNByO7v9iRgfQ5JsEnq65hqL5WmXnNEfud_FgH-mNNp-MeqfyAKCibd9h0RqLHXhI0rV83cFSBH3YpfaT-QQ3vnv4fJEA4f0oGCHMw_IMQRyo3v27J63Yq7aeYv6dHVrkbyNvjB7'
  },
  {
    title: 'Titan Braided Cable',
    price: 999,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIN33hzTNRFdKtO8BNwUcyBiWCVt4uggUwHw6YHujE8ddZLimbMPztX-ArE4eBIlo7EJ42Auo6UWINOi1Kv0X37fye5qtOL3pnpiJDHPnQtUCOTHm7SIT0eFCQdF-J7yL6dpWf7h0HgsDZ3oUykkrpOTV5vJB9A2PPHYrv6ppXUgMP9d2tmllbQMuvgIPVAFgNSk48890QJ9NzAqtzBcTr_8qmUDL0RQxQ88_KQprVaY4xYvr_dD5bdcmI8_62tmA1seAsVBNLN-Eu'
  }
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Selection states
  const [selectedBrand, setSelectedBrand] = useState('iPhone');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.deviceModels?.length > 0) setSelectedModel(data.deviceModels[0]);
        if (data.materials?.length > 0) setSelectedMaterial(data.materials[0]);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf8fc]">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#4648d4]">progress_activity</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf8fc] p-6">
        <p className="text-lg font-bold mb-4">Product not found.</p>
        <Link to="/shop" className="bg-[#4648d4] text-white px-6 py-2.5 rounded-lg font-semibold">Back to Shop</Link>
      </div>
    );
  }

  const galleryImages = product.images?.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef'
  ];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedModel,
      selectedMaterial,
      selectedBrand
    }, 1);
    toast.success(`Added ${product.title} (${selectedModel}, ${selectedMaterial}) to cart!`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#e1e0ff] selection:text-[#07006c] min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-[1.25rem] h-16 bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)} 
          aria-label="Go back" 
          className="w-10 h-10 flex items-center justify-center hover:opacity-70 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <span className="material-symbols-outlined text-black">arrow_back</span>
        </button>
        <span className="font-bold text-lg text-black tracking-tight font-display">CoverScart</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleWishlist(product)} 
            className="w-10 h-10 flex items-center justify-center hover:opacity-70 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{
              fontVariationSettings: isInWishlist(product.id) ? "'FILL' 1" : "'FILL' 0",
              color: isInWishlist(product.id) ? '#ba1a1a' : 'inherit'
            }}>
              favorite
            </span>
          </button>
          <button 
            onClick={handleShare} 
            className="w-10 h-10 flex items-center justify-center hover:opacity-70 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined text-black">share</span>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-32">
        {/* Hero Section: Product Gallery */}
        <section className="w-full bg-[#ffffff]">
          <div className="relative w-full aspect-square md:aspect-[16/9] overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out h-full" 
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={product.title}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>
            {/* Gallery Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${
                    activeSlide === idx ? 'bg-black' : 'bg-[#cfc4c5]'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 px-[1.25rem] py-4 overflow-x-auto no-scrollbar">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeSlide === idx ? 'border-black' : 'border-transparent'
                }`}
              >
                <img className="w-full h-full object-cover" src={img} alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        </section>

        {/* Product Info Section */}
        <section className="px-[1.25rem] mt-6">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-[#4648d4] tracking-widest uppercase">Premium Series</span>
            <div className="flex items-center gap-1 text-[#1b1b1e]">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-semibold">{product.rating || '4.9'} (128 reviews)</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black mb-2 font-display">{product.title}</h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-black">₹{(product.salePrice || product.price).toLocaleString()}</span>
            {product.salePrice && (
              <>
                <span className="text-sm text-[#7e7576] line-through">₹{product.price.toLocaleString()}</span>
                <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-[10px] font-bold uppercase">25% OFF</span>
              </>
            )}
          </div>

          {/* Selectors */}
          <div className="space-y-6">
            {/* Brand Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#4c4546] tracking-wider uppercase mb-3">SELECT BRAND</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBrand('iPhone')}
                  className={`flex-1 py-3 px-4 border-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    selectedBrand === 'iPhone' ? 'border-black bg-black text-white' : 'border-[#cfc4c5]/60 text-black hover:border-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">smartphone</span> iPhone
                </button>
                <button
                  onClick={() => setSelectedBrand('Samsung')}
                  className={`flex-1 py-3 px-4 border-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    selectedBrand === 'Samsung' ? 'border-black bg-black text-white' : 'border-[#cfc4c5]/60 text-black hover:border-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">stay_current_portrait</span> Samsung
                </button>
              </div>
            </div>

            {/* Model Selection */}
            {product.deviceModels?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#4c4546] tracking-wider uppercase mb-3">SELECT MODEL</label>
                <div className="grid grid-cols-3 gap-2">
                  {product.deviceModels.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`py-2.5 border-2 rounded-lg text-xs font-semibold text-center cursor-pointer transition-all ${
                        selectedModel === model ? 'border-black text-black bg-black/5' : 'border-[#cfc4c5]/60 text-[#4c4546] hover:border-black'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Selection */}
            {product.materials?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#4c4546] tracking-wider uppercase mb-3">CASE MATERIAL</label>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`px-4 py-2 border rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedMaterial === mat ? 'bg-[#eae7eb] border-black text-black' : 'border-[#cfc4c5]/60 text-[#4c4546] hover:border-black'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="mt-[2.5rem] p-4 bg-[#f6f2f7] rounded-xl border border-[#cfc4c5]/20 space-y-4">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#4648d4]">local_shipping</span>
              <div>
                <p className="text-xs font-bold text-[#1b1b1e]">Free Express Delivery</p>
                <p className="text-xs text-[#4c4546]">Estimated delivery: 2-3 business days.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#4648d4]">verified_user</span>
              <div>
                <p className="text-xs font-bold text-[#1b1b1e]">2-Year Warranty</p>
                <p className="text-xs text-[#4c4546]">Guaranteed protection against yellowing and defects.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mt-[2.5rem] px-[1.25rem]">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-lg font-bold text-black font-display">Customer Stories</h2>
              <p className="text-xs text-[#4c4546]">Real protection, real users.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-white rounded-2xl border border-[#cfc4c5]/10 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e1e0ff] flex items-center justify-center font-bold text-[#07006c] text-xs">MA</div>
                  <span className="text-xs font-semibold text-black">Marcus A.</span>
                </div>
                <div className="flex text-[#FFB800]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#4c4546] italic">"The texture is unlike any other silicon case I've owned. It feels incredibly premium and survived a 4ft drop onto concrete without a scratch on the phone."</p>
            </div>
            <div className="p-5 bg-[#f6f2f7] rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-black">Sarah J.</span>
                <span className="text-[10px] text-gray-400">Verified Purchase</span>
              </div>
              <p className="text-xs text-[#4c4546]">Perfect fit for my iPhone 15 Pro. The tactile buttons are a game changer.</p>
            </div>
          </div>
        </section>

        {/* Complete the Look suggestions */}
        <section className="mt-[2.5rem] mb-10">
          <h3 className="text-lg font-bold text-black px-[1.25rem] mb-4 font-display">Complete the Look</h3>
          <div className="flex gap-4 px-[1.25rem] overflow-x-auto no-scrollbar">
            {COMPLETE_LOOK_ITEMS.map((item, index) => (
              <div 
                key={index} 
                onClick={() => navigate('/shop')}
                className="min-w-[160px] group cursor-pointer"
              >
                <div className="aspect-square bg-[#f6f2f7] rounded-xl mb-3 overflow-hidden border border-[#cfc4c5]/25">
                  <img 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={item.img} 
                  />
                </div>
                <p className="text-xs font-semibold text-black">{item.title}</p>
                <p className="text-xs text-[#4648d4] font-bold">₹{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action Bar + Navigation */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-t border-[#cfc4c5]/20 shadow-lg">
        {/* Floating Add to Cart Action */}
        <div className="px-[1.25rem] py-4 flex gap-4 items-center">
          <div className="flex-1">
            <button
              onClick={handleAddToCart}
              className="w-full h-14 bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
              Add to Cart
            </button>
          </div>
        </div>

        {/* Navigation Shell */}
        <nav className="flex justify-around items-center h-16 pb-safe">
          <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-all cursor-pointer">
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Home</span>
          </button>
          <button onClick={() => navigate('/shop')} className="flex flex-col items-center justify-center text-[#4648d4] relative transition-all cursor-pointer">
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
    </div>
  );
}
