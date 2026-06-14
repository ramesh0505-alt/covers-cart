import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSEO() {
  const [redirects, setRedirects] = useState([
    { id: 'red-1', from: '/old-cases-promo', to: '/collections/best-sellers', status: '301 Permanent' },
    { id: 'red-2', from: '/products/leather-case-old', to: '/product/vintage-leather-wallet-case', status: '301 Permanent' }
  ]);

  const [metaTemplates, setMetaTemplates] = useState({
    productTitle: '{{product_name}} | Buy Premium Phone Cover - CoverScart',
    productDesc: 'Get the best protective {{product_name}} at CoverScart. Premium materials, high definition print, free shipping options available.',
    categoryTitle: 'Shop {{category_name}} online - CoverScart'
  });

  const [newRedirect, setNewRedirect] = useState({ from: '', to: '' });

  const handleAddRedirect = (e) => {
    e.preventDefault();
    if (!newRedirect.from || !newRedirect.to) return;
    setRedirects(prev => [...prev, { id: `red-${Date.now()}`, ...newRedirect, status: '301 Permanent' }]);
    toast.success('Sitemap redirect rule added!');
    setNewRedirect({ from: '', to: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">SEO Management Center</h1>
        <p className="text-xs text-zinc-500 font-medium">Configure meta templates tags, redirect structures, canonical links, and inspect broken URLs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Meta Templates */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Meta Title & Description Templates</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Global Product Page Title Meta</label>
              <input 
                type="text" 
                value={metaTemplates.productTitle}
                onChange={(e) => setMetaTemplates({ ...metaTemplates, productTitle: e.target.value })}
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Global Product Page Description Meta</label>
              <textarea 
                value={metaTemplates.productDesc}
                onChange={(e) => setMetaTemplates({ ...metaTemplates, productDesc: e.target.value })}
                className="w-full border border-zinc-200 p-2.5 rounded-lg h-20 leading-relaxed font-semibold text-zinc-650"
              />
            </div>
            <button onClick={() => toast.success('SEO global metadata templates updated!')} className="bg-black text-white px-4 py-2.5 rounded-xl font-bold active:scale-95 transition-all">
              Save Templates
            </button>
          </div>
        </div>

        {/* Redirect Manager */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">URL Redirects (301/302)</h3>
          
          <form onSubmit={handleAddRedirect} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">From URL Path</label>
              <input 
                type="text" 
                value={newRedirect.from}
                onChange={(e) => setNewRedirect({ ...newRedirect, from: e.target.value })}
                placeholder="e.g. /old-url"
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">To Destination Path</label>
              <input 
                type="text" 
                value={newRedirect.to}
                onChange={(e) => setNewRedirect({ ...newRedirect, to: e.target.value })}
                placeholder="e.g. /new-destination"
                className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-xl font-bold transition-all cursor-pointer">
              Deploy Redirect
            </button>
          </form>

          <div className="space-y-2 mt-4">
            {redirects.map((r) => (
              <div key={r.id} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-150 text-[10px] font-semibold text-zinc-650 leading-relaxed">
                <div>From: <span className="font-mono">{r.from}</span></div>
                <div>To: <span className="font-mono text-indigo-700">{r.to}</span></div>
                <div className="text-[9px] text-zinc-450 mt-1">{r.status} Redirect</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
