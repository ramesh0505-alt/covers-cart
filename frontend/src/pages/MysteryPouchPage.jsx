import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const VIBES = [
  { id: 'anime', name: 'Anime', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf8Ni8U35CXdr4hQ8ZZuTZxQi0Iv1eZwNMKIuT0CcnwJXmMt-9ZUMpnC_Apan27W_k78fHOqq49DADeqOM3hVmhHVDabXFJzMiBhsZn7ze2INBrcLkKIfsrIlNTUqsqwTYSxjs17vcfk1RnNOYjTgLwOv2TaZaexaP4WIJ8zhDQbx-4TFWL-31I8kEtXFT4bNNLAJcQDYE_J-RTQfumFm6RZ9T9_2i_hqVQhrcdq8_9rEFO_fVmGZ6lUPfL89796ha5uHhKXRby_5k' },
  { id: 'dark', name: 'Dark', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXoV0AhX7sDIJa-FrR_OebbABsZP6be29LFjTBvFpPxot0oGa-j1GFaMklyCxjOZe3YVb7TX6u0aeQePjA9M8vjJV0HZRgLfoLy6OeV2vmxah-pOLnB18-33P7gONufsMfsmXdJAWow6dxJ-eBDAOs0MS8EtJuETlyy3-hyAOsB2Ly7975Z3IqrL1SzZYtEMHOOF8tF5j0p_KO5C6RwrbzTCWYXBRwKeQWu7kJ14tTvlCA6XQj61EPHD9lyWh1wc2T0_X2lRp0OWdt' },
  { id: 'cute', name: 'Cute', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAekEprwbqrzIF0zs4RaRWPam8LSszLKmOWkX-RT4PbsQ6ckpl7NRZqVm0bSWYf3NFbiGXy1GdhuEDBh0DgYYD8ZjJiIM79mJlN5z2X-5G_l7SP5nq4MowGiJCfq66XuMqJWE9wDEYRM1ZJMByVz-1E2VIyWbEgmIs3PJJnev46DOB9xHQ60nSvEvCPjn3BcchovlGg54FLWCHYxRRBoZHCfH9DCEBQxWEVeQ5HImi5bmKVl5Cmw_9V5T75lAiyFwvxShWmfclaX3sl' },
  { id: 'minimal', name: 'Minimal', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuQ0nKBBORifQpyHlfXk16_ApGomIlQr5tvnFAfEKXWosXSYM1VtxMq2o-EtP7jlIxioH4IdJ23pz2ysSCWdBsE8RAqlrEHOzs_dD9vsO8vdxA7hOcdUyqWs2GZxniQFWm241qkevUDWOh7uZyVIjBLe-txdNmHH7RshI_Z1ZE3WVG6QC8sy9pcWSJSSJhGZTLaSrRzfNISx-2Sy672KBdcDpJq102SOSgmHt7UIIZocDRJUgqJvanWOYF8-Kf7ztD6zmOyZhrdAsZ' },
  { id: 'hacker', name: 'Hacker', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwtW7h0nu9mKyIvnDrb2Ib1_408jNXTm3QhoAUs_ydHQ5bfsGNJLMDL3it3u_fBSkiPwkBuWpjrO_EYgzoqP1y0il-2opAjW82VlYu0c_mH0nbmNFBdZR2_YtTHHQ92JCLlbGGwvK-9sW22--ubdgoQtj3IlYU58-W5UXX5IuQZ0SSr8nogWG8q1yOMQLgN6_FBCCvRLtR0bIFZMTE9L7CdsvYus9_VEzkABVFkDMCEs5MSz0cdOx383cjgog7uRXkR3JTcXRwBxPS' },
  { id: 'aesthetic', name: 'Aesthetic', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-zbvkXmNbxjgvw05U5pgLdyefK3EHtV1F-qj60W1avvQ6Kmun7bWDlyKa5u2or2A8cx5vSv26cdT_RGHvTeIlBf_U6jEvPG3HllpLZTTglke4VoO7oJDw01gerkXOWwkkX0jZUFHBtZaYK4u7h5yGNn1r4-G5g1Al1A8xe5Yfkz5KMKpkpD7r0mzqPr77zcUb-ZE14xsxPCh1xTrXx5d3-wuis9GPYvg3DbegyqjEmfqS5PH0GKvmnXTzzJAXWlfV5WvDgA_lzg-' },
  { id: 'streetwear', name: 'Streetwear', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUQV-Al7EWmtrMNqzEC8thVw9AtOcRLKT7rp-pMcAkvCQbtUbpYuqfQmmtdann0kNkMglKwJtFZzA2ln8wjoXZrbejE_c69KVSJ7K2tKcexp3CIXGGPrLSQJUaibMGbnFYRy23Zml_198DgLmy3BSOZMP-SWl53hptBTrvuneUoDkFjNNfDfDK7xFJefViXVaYQkv9WNj6k5yCNc3Zw8RWYwhY4so4VYvKjdO_bJ-senaAVWkGpyLa4OYVtlMUA6JTkRfUpLXrteUR' },
  { id: 'luxury', name: 'Luxury', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzW20uX6gMNk1-EeIQ4wbcZb-YDolxDeKBcWkxjeyTP1JYyr_YGe318f4_mLWriYLA0Sb_xD1Mx3YGONUyJriRvUGajJRcuoN8F2-LvJ_3-RwNG3P5d-J3SWzIiHDIPzTV9f8QzBWCM53mlgxtNAf_ZHzOCGKHJ2D31Axc_4cusl6NvHwMLtNqqH2EhI5ZpCf1g5ZneW4dlzI3wEjuf8YFYLc3WHLwDu6EjQwdRkwi6Wei6mqA1RiDQ6g1EdV1p7v7uY9spC3BTL5j' },
  { id: 'gaming', name: 'Gaming', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2S_aaaSZJuJtPM53Tqf1PLMiaf1NSHb9vLRU0UdGfXUPJu5myEFsKhzdQX4P1JxVLCHAJtgbrQN7NJwMXYhNaeeaa3lcpQD_D9LtbmGuYQRlZQd7WvRm2dHlZ-B5SDYV2Mgc0f1jW0hQ3eOVTCUbJbVQ_1_aRBPW9HGSk-5n3MdgylACPPT_AEcb96FlFjPdER_2TA_sYBbyepMv-4W6CKD_wbHdK2aap_QEq8DAWw2mWDZ5Ckpeuaj_tQR2oS4dHH6Wz7t6myzV9' }
];

export default function MysteryPouchPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('iPhone 15 Pro Max');
  const [vibe, setVibe] = useState('anime');
  const [pouchType, setPouchType] = useState('essential');
  const [ordering, setOrdering] = useState(false);

  const handleOrder = () => {
    setOrdering(true);
    toast.loading('Preparing your custom mystery drop pouch...', { id: 'ordering-pouch' });

    setTimeout(() => {
      const price = pouchType === 'essential' ? 1599 : 2499;
      const mysteryItem = {
        id: `mystery-pouch-${pouchType}-${vibe}-${Date.now()}`,
        title: `Mystery Pouch (${pouchType === 'essential' ? 'Essential' : 'Elite'} - ${vibe.toUpperCase()})`,
        price: price,
        salePrice: null,
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD0zMup3X61YDNq03chou4CWVI1KbXKBpGEt1eP9cXXxjvUKqwRaHhk06aNmtdVkvK-6WEhn9o43atQhSSsw7iHLNyx6JsccAFQlne0C7jzlacIs4gltAUCM-WzDlNFwCu6ZqVw3RZCxUfS8cynpPmgfO-5Oa3tvCUfOGQnW80cQ1miNJ-ZcPobusnSkIWNaew-x1V662b87ivcl8rBgHUNiUEe6iaWXrpB8FO3hekWXEeYb6Yna0KJ-FrtdmbsH0caXvjwX1zPon5c'],
        deviceModels: [model],
        materials: [pouchType === 'essential' ? 'Silicone & Hybrid' : 'Premium Leather & Carbon']
      };

      addToCart(mysteryItem, 1);
      toast.success('Mystery Pouch added to cart!', { id: 'ordering-pouch', icon: '✨' });
      setOrdering(false);
      navigate('/cart');
    }, 1200);
  };

  const models = brand === 'iPhone' 
    ? ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro']
    : ['Samsung S24 Ultra', 'Samsung S24+', 'Samsung S24', 'Samsung S23 Ultra'];

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#c0c1ff] overflow-x-hidden min-h-screen pb-48">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 border-b border-[#cfc4c5]/30 backdrop-blur-md bg-surface/90">
        <button 
          onClick={() => navigate(-1)} 
          className="hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-10 h-10"
        >
          <span className="material-symbols-outlined text-black">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-black font-display cursor-pointer" onClick={() => navigate('/')}>CoverScart</h1>
        <button 
          onClick={() => navigate('/shop')} 
          className="hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer flex items-center justify-center w-10 h-10"
        >
          <span className="material-symbols-outlined text-black">search</span>
        </button>
      </header>

      <main className="pt-20 px-5 max-w-2xl mx-auto">
        {/* Hero Mystery Section */}
        <section 
          className="relative overflow-hidden rounded-xl h-80 mb-[1.5rem] flex flex-col items-center justify-center text-center p-6 shadow-2xl"
          style={{
            background: 'radial-gradient(circle at center, #1b1b1e 0%, #000000 100%)'
          }}
        >
          <div className="absolute inset-0 opacity-40">
            <img 
              alt="Mystery Pouch Backdrop" 
              className="w-full h-full object-cover mix-blend-overlay" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0zMup3X61YDNq03chou4CWVI1KbXKBpGEt1eP9cXXxjvUKqwRaHhk06aNmtdVkvK-6WEhn9o43atQhSSsw7iHLNyx6JsccAFQlne0C7jzlacIs4gltAUCM-WzDlNFwCu6ZqVw3RZCxUfS8cynpPmgfO-5Oa3tvCUfOGQnW80cQ1miNJ-ZcPobusnSkIWNaew-x1V662b87ivcl8rBgHUNiUEe6iaWXrpB8FO3hekWXEeYb6Yna0KJ-FrtdmbsH0caXvjwX1zPon5c" 
            />
          </div>
          <div className="relative z-10 space-y-2">
            <span className="inline-block px-3 py-1 bg-[#4648d4] text-white rounded-full text-xs font-bold tracking-widest uppercase">Limited Edition</span>
            <h2 className="text-4xl font-extrabold text-white font-display">Mystery Pouch</h2>
            <p className="text-sm text-white/80 max-w-xs mx-auto">One random premium case. Every order is unique. Will you get the rare drop?</p>
          </div>
          {/* Shimmering overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-pulse"></div>
        </section>

        {/* Selection Form */}
        <div className="space-y-[2.5rem]">
          {/* Brand Selection */}
          <div className="space-y-[1rem]">
            <label className="text-xs font-bold text-[#4c4546] uppercase tracking-wider">Select Mobile Brand</label>
            <div className="flex flex-wrap gap-[1rem]">
              <button 
                onClick={() => { setBrand('iPhone'); setModel('iPhone 15 Pro Max'); }}
                className={`px-6 py-3 rounded-lg border-2 font-semibold flex-1 min-w-[140px] transition-all cursor-pointer ${
                  brand === 'iPhone' ? 'border-black bg-black text-white' : 'border-[#cfc4c5] hover:border-black text-[#1b1b1e]'
                }`}
              >
                iPhone
              </button>
              <button 
                onClick={() => { setBrand('Samsung'); setModel('Samsung S24 Ultra'); }}
                className={`px-6 py-3 rounded-lg border-2 font-semibold flex-1 min-w-[140px] transition-all cursor-pointer ${
                  brand === 'Samsung' ? 'border-black bg-black text-white' : 'border-[#cfc4c5] hover:border-black text-[#1b1b1e]'
                }`}
              >
                Samsung
              </button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-[1rem]">
            <label className="text-xs font-bold text-[#4c4546] uppercase tracking-wider">Your Device Model</label>
            <div className="relative">
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-14 pl-4 pr-10 border border-[#cfc4c5] rounded-lg appearance-none bg-white focus:ring-2 focus:ring-black focus:border-black outline-none text-sm"
              >
                {models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Select Your Vibe Section */}
          <div className="space-y-[1rem]">
            <label className="text-xs font-bold text-[#4c4546] uppercase tracking-wider">Select Your Vibe</label>
            <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar -mx-5 px-5">
              {VIBES.map((v) => (
                <button 
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className="group flex-none w-32 space-y-2 text-center transition-all focus:outline-none cursor-pointer"
                >
                  <div className={`w-32 h-32 rounded-xl overflow-hidden border-2 transition-all group-active:scale-95 ${
                    vibe === v.id ? 'border-[#4648d4]' : 'border-transparent'
                  }`}>
                    <img alt={v.name} className="w-full h-full object-cover" src={v.img} />
                  </div>
                  <span className={`block text-xs font-semibold ${
                    vibe === v.id ? 'text-[#4648d4] font-bold' : 'text-black'
                  }`}>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pouch Type Selection (Bento Style Chips) */}
          <div className="space-y-[1rem]">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-[#4c4546] uppercase tracking-wider">Pouch Type</label>
              <span 
                className="text-xs font-bold text-[#4648d4] cursor-pointer hover:underline" 
                onClick={() => toast('Probabilities: Essential: 70% Silicone, 30% Hybrid. Elite: 60% Leather, 40% Carbon.')}
              >
                View Probabilities
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPouchType('essential')}
                className={`p-4 rounded-xl border-2 text-left transition-all hover:bg-neutral-50 cursor-pointer ${
                  pouchType === 'essential' ? 'border-[#4648d4] bg-[#e1e0ff]/10' : 'border-[#cfc4c5]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: pouchType === 'essential' ? "'FILL' 1" : "'FILL' 0" }}>auto_awesome</span>
                  <span className="text-xs font-bold text-black">₹1,599</span>
                </div>
                <h4 className="font-bold font-display text-sm text-black">The Essential</h4>
                <p className="text-xs text-[#4c4546] mt-0.5">Silicon &amp; Hybrid cases</p>
              </button>
              <button 
                onClick={() => setPouchType('elite')}
                className={`p-4 rounded-xl border-2 text-left transition-all hover:bg-neutral-50 cursor-pointer ${
                  pouchType === 'elite' ? 'border-[#4648d4] bg-[#e1e0ff]/10' : 'border-[#cfc4c5]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: pouchType === 'elite' ? "'FILL' 1" : "'FILL' 0" }}>military_tech</span>
                  <span className="text-xs font-bold text-black">₹2,499</span>
                </div>
                <h4 className="font-bold font-display text-sm text-black">The Elite</h4>
                <p className="text-xs text-[#4c4546] mt-0.5">Leather &amp; Carbon drops</p>
              </button>
            </div>
          </div>

          {/* Warning/Info Section */}
          <div className="backdrop-blur-md bg-white/80 border border-[#cfc4c5]/50 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="flex gap-4 items-start">
              <span className="material-symbols-outlined text-[#ba1a1a] mt-1">error_outline</span>
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-black">The Mystery Policy</h5>
                <ul className="text-xs text-[#4c4546] space-y-1 list-disc pl-4">
                  <li>No returns, no exchanges for mystery items.</li>
                  <li>Random surprise design from our premium vault.</li>
                  <li>Guaranteed fit for your selected model.</li>
                  <li>Every order is uniquely curated.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky footer action button */}
      <div className="fixed bottom-24 left-0 w-full px-5 z-40 max-w-2xl mx-auto right-0">
        <button 
          onClick={handleOrder}
          disabled={ordering}
          className="w-full h-16 bg-black text-white font-bold rounded-lg shadow-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 hover:bg-neutral-800"
        >
          <span className="material-symbols-outlined">shopping_bag</span>
          {ordering ? 'Adding to Cart...' : 'Order Surprise Pouch'}
        </button>
      </div>
    </div>
  );
}
