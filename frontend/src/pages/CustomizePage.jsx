import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PATTERNS = {
  Marble: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4C3NXBW9xQ7UhQpEoLwzD3QT5lW8QvVmSQcgQ85SpYL9FCCyC0_SPNHP3GzCqF_79K2xnfSbk6cCQ6lonkfasXsNb8EWe7RQ4jYEbLwXCGdVfJVtx0QzEhfAJ_XaiZ8S9b-k4a0wB1RCn6fkDgHqQiEitqwnob4LlFSKzkIeLWjDio22vu-WOcnBif5AA6F9UdH4XRRCHxlhe8BsZFfUzOLzs5i168W-B0LmpcSNue2d79fuynr6SrWa1Lbf2ScSmTkgz2uVSn4M',
  Cyber: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2YgKTDTFZXwHYGvIej_tgmYoUoC7WgZu8TQrrYDA2RZfSVNaGbbml3CScvPY6SH4vgCCbYEyYIOVG-cqMpnGQrqQzmKTpqp3l5-2ahRpl6pcUxVCsMScWXT79fzD86eQCz7V3zoiJW38sbgAvt7Q9GYB_3rrdlq4ukMEaXOFgzbmTNJdpoS7zu-VshyIHarVj-7mo9MX_5m6iYOwYyVV1js65vOgn0HrGHqpYcGLVI4GsaQHj1NC91l62ijZ4DFuKKIVINeQe05I',
  Liquid: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-mjXSwzBcxa-hiDzEz1-39Y9QOhEbx_pUrISiJHEH-5gt_C331QlV9nE_sTNiw6n3v5UP09C3G9j3J26w4q27SIM6hOG49PCDI-QFvXaObJ6mphdyDr2YPnEkNSZ3UTIZPdcnJfsXOdmScSf73SuF15_fFxoGZyPos2e6MkINiNV_2DPbGMYsVLmGJo_5Mtq1gmQra-yE3EMQyoZYPy7sUIK0fDM_oiYvMjqJqX7JX3ReWDnO7NkvqZZV1nkP9Ey8EOo8CehFwco',
  Duo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEwXFQTfdBcs7e4tD4BO0u4954dAIYduAi6aNAFTRrzvCmdLhk92aTNfKb19PaXsNFGto1tYpdwNiJ4kCHCAUwCJY349gsIRdSlDUYCodYgRwwDtvkgkkjIjPILr294BjV6Z-jWXdZcAXrwLMIeza03kRavZm-U6DUoFln_Fe4YeAdv8E8RO6sSVp8hfmBJB5CTCuiLFhedPnfm_RyQdpf2Gb6PtneMSXwfNroGAb8Rg-oCHoxmjE2PTHr7T8fvS7AxHMDIlmcqRs'
};

const MATERIALS = [
  { id: 'glass', name: 'Ultra Glass', label: 'Premium Gloss', surcharge: 0, icon: 'glass' },
  { id: 'silicone', name: 'Liquid Silicone', label: 'Soft Touch', surcharge: 100, icon: 'texture' },
  { id: 'leather', name: 'Eco Leather', label: 'Sustainable', surcharge: 250, icon: 'potted_plant' },
  { id: 'armor', name: 'Tough Armor', label: 'Rugged Protection', surcharge: 150, icon: 'security' }
];

export default function CustomizePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Customization States
  const [selectedPattern, setSelectedPattern] = useState('Marble');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [customText, setCustomText] = useState('');
  const [fontStyle, setFontStyle] = useState('Hanken Bold');
  const [textColor, setTextColor] = useState('#ffffff');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 15 Pro');
  const [material, setMaterial] = useState('glass');
  const [adding, setAdding] = useState(false);

  // Derived price: base ₹499 + material surcharge
  const basePrice = 499;
  const currentMaterial = MATERIALS.find((m) => m.id === material) || MATERIALS[0];
  const totalPrice = basePrice + currentMaterial.surcharge;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result);
        setSelectedPattern(''); // Clear pattern selection in favor of upload
        toast.success('Design uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    setAdding(true);
    toast.loading('Saving your design and adding to cart...', { id: 'custom-case' });

    setTimeout(() => {
      const caseItem = {
        id: `custom-case-${Date.now()}`,
        title: `Custom Case (${brand} ${model})`,
        price: totalPrice,
        salePrice: null,
        images: [uploadedImage || PATTERNS[selectedPattern] || PATTERNS.Marble],
        deviceModels: [model],
        materials: [currentMaterial.name],
        customText: customText || undefined,
        textColor: customText ? textColor : undefined,
        fontStyle: customText ? fontStyle : undefined
      };

      addToCart(caseItem, 1);
      toast.success('Custom design added to cart!', { id: 'custom-case', icon: '🎨' });
      setAdding(false);
      navigate('/cart');
    }, 1200);
  };

  const models = brand === 'Apple'
    ? ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14']
    : brand === 'Samsung'
      ? ['Galaxy S24 Ultra', 'Galaxy S24', 'Galaxy S23 Ultra']
      : ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro'];

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] font-sans selection:bg-[#eaedff] min-h-screen pb-40">
      {/* TopAppBar Navigation Shell */}
      <header className="bg-[#faf8ff] text-[#00695c] w-full sticky top-0 z-50 border-b border-[#bdc9c5] flex justify-between items-center px-5 py-2 h-16 backdrop-blur-md bg-opacity-90">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center w-10 h-10 hover:bg-[#f2f3ff] rounded-lg transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#131b2e]">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">Case Designer</h1>
        <button 
          onClick={() => navigate('/cart')} 
          className="flex items-center justify-center w-10 h-10 hover:bg-[#f2f3ff] rounded-lg transition-colors active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[#131b2e]">shopping_bag</span>
        </button>
      </header>

      <main className="pb-32">
        {/* Hero Preview Section */}
        <section className="relative w-full h-[45vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#faf8ff] to-[#f2f3ff]">
          <div className="relative z-10 group cursor-pointer transition-transform duration-500 hover:scale-105">
            <div className="w-44 h-80 bg-white rounded-[2rem] border-8 border-black relative overflow-hidden transition-all duration-700 shadow-2xl">
              {/* Dynamic Content Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ 
                  backgroundImage: `url('${uploadedImage || PATTERNS[selectedPattern] || PATTERNS.Marble}')` 
                }}
              />
              {/* Overlay Texture for realism */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
              
              {/* Custom Text Overlay */}
              {customText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span 
                    style={{ 
                      color: textColor,
                      fontFamily: fontStyle === 'Serif Modern' ? 'serif' : fontStyle === 'Mono Space' ? 'monospace' : 'sans-serif'
                    }} 
                    className="font-bold text-lg drop-shadow-md tracking-wider text-center max-w-[80%] break-words uppercase"
                  >
                    {customText}
                  </span>
                </div>
              )}
            </div>
            {/* 3D Float Effect Shadow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-3 bg-black/10 blur-lg rounded-full" />
          </div>
        </section>

        {/* Customization Panel */}
        <div className="px-5 mt-8 space-y-10 max-w-xl mx-auto">
          {/* Step 1: Base Pattern */}
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-base font-bold">1. Select Base Pattern</h2>
              <span className="text-xs text-[#6e7a76]">Optional</span>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
              {Object.keys(PATTERNS).map((key) => (
                <button 
                  key={key}
                  onClick={() => { setSelectedPattern(key); setUploadedImage(null); }}
                  className="flex-shrink-0 w-24 space-y-2 group cursor-pointer"
                >
                  <div className={`aspect-[2/3] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPattern === key && !uploadedImage
                      ? 'border-[#00695c] ring-2 ring-[#00695c] ring-offset-2' 
                      : 'border-transparent group-hover:border-[#bdc9c5]'
                  }`}>
                    <img alt={key} className="w-full h-full object-cover" src={PATTERNS[key]} />
                  </div>
                  <p className={`text-center text-[10px] tracking-wider uppercase font-bold ${
                    selectedPattern === key && !uploadedImage ? 'text-[#00695c]' : 'text-[#3e4946]'
                  }`}>{key}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Personalize with Image */}
          <section>
            <h2 className="text-base font-bold mb-4">2. Personalize with Image</h2>
            <label className="border-2 border-dashed border-[#bdc9c5] rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-white hover:bg-[#eaedff]/20 transition-colors cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              <div className="w-16 h-16 rounded-full bg-[#00695c]/10 flex items-center justify-center text-[#00695c] mb-2 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-4xl">cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm text-[#131b2e]">Upload Your Design</p>
                <p className="text-xs text-[#6e7a76] mt-1">High resolution PNG/JPG (Max 10MB)</p>
              </div>
            </label>
          </section>

          {/* Step 3: Add Custom Text */}
          <section>
            <h2 className="text-base font-bold mb-4">3. Add Custom Text</h2>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bdc9c5] space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6e7a76] mb-1">Your Message</label>
                <input 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#bdc9c5] focus:ring-2 focus:ring-[#00695c] focus:border-[#00695c] outline-none transition-all text-sm" 
                  placeholder="Type here..." 
                  maxLength={15}
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6e7a76] mb-1">Font Style</label>
                  <select 
                    value={fontStyle}
                    onChange={(e) => setFontStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#bdc9c5] bg-white text-xs"
                  >
                    <option>Hanken Bold</option>
                    <option>Serif Modern</option>
                    <option>Mono Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6e7a76] mb-1">Color</label>
                  <div className="flex gap-2 py-1">
                    {['#ffffff', '#0E0E0E', '#00695c', '#4ae176'].map((color) => (
                      <button 
                        key={color}
                        onClick={() => setTextColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full border border-[#bdc9c5] cursor-pointer ${
                          textColor === color ? 'ring-2 ring-[#00695c] ring-offset-2' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Device Selection */}
          <section>
            <h2 className="text-base font-bold mb-4">4. Select Your Device</h2>
            <div className="space-y-3">
              <div className="relative">
                <select 
                  value={brand}
                  onChange={(e) => { setBrand(e.target.value); setModel(e.target.value === 'Apple' ? 'iPhone 15 Pro' : e.target.value === 'Samsung' ? 'Galaxy S24 Ultra' : 'Pixel 8 Pro'); }}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-[#bdc9c5] bg-white focus:ring-2 focus:ring-[#00695c] outline-none text-sm"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Google">Google</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e7a76]">expand_more</span>
              </div>
              <div className="relative">
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-xl border border-[#bdc9c5] bg-white focus:ring-2 focus:ring-[#00695c] outline-none text-sm"
                >
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e7a76]">expand_more</span>
              </div>
            </div>
          </section>

          {/* Step 5: Material */}
          <section>
            <h2 className="text-base font-bold mb-4">5. Choose Material</h2>
            <div className="grid grid-cols-2 gap-3">
              {MATERIALS.map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMaterial(m.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md cursor-pointer ${
                    material === m.id ? 'border-[#00695c] bg-[#00695c]/5' : 'border-[#bdc9c5] bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`material-symbols-outlined ${material === m.id ? 'text-[#00695c]' : 'text-[#6e7a76]'}`}>{m.icon}</span>
                    <span className={`text-[10px] font-bold ${material === m.id ? 'text-[#00695c]' : 'text-black'}`}>
                      {m.surcharge === 0 ? 'FREE' : `+₹${m.surcharge}`}
                    </span>
                  </div>
                  <p className="font-bold text-sm text-[#131b2e]">{m.name}</p>
                  <p className="text-[9px] text-[#6e7a76] uppercase tracking-wider mt-1">{m.label}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-4 bg-white/80 backdrop-blur-md border-t border-[#bdc9c5]/30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6e7a76] uppercase tracking-widest">Total Price</span>
            <span className="text-2xl font-bold text-[#00695c]">₹{totalPrice}.00</span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-grow bg-black text-white h-14 rounded-full font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
