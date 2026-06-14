import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminCMS() {
  const [sections, setSections] = useState([
    { id: 'sec-1', name: 'Hero Main Banner Slider', status: 'Published', type: 'Hero' },
    { id: 'sec-2', name: 'Featured Trending Products Grid', status: 'Published', type: 'Product Grid' },
    { id: 'sec-3', name: 'Limited Drops Promo Counter', status: 'Published', type: 'Marketing Drop' },
    { id: 'sec-4', name: 'Mystery Pouch Interactive Box', status: 'Published', type: 'Gamification' },
    { id: 'sec-5', name: 'Loyalty Rewards CTA Banner', status: 'Draft', type: 'Banner' },
    { id: 'sec-6', name: 'Footer Navigation links', status: 'Published', type: 'Footer' }
  ]);

  const handleToggleStatus = (id) => {
    setSections(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Published' ? 'Draft' : 'Published';
        toast.success(`Section visibility set to ${nextStatus}!`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const moveSection = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated);
    toast.success('Layout ordering rearranged!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">CMS Storefront homepage layout builder</h1>
        <p className="text-xs text-zinc-500 font-medium">Configure active banner slides, customize grid arrangements, and rearrange homepage sections.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sections Listing / Ordering */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Homepage Section Blocks</h3>
          <div className="space-y-2.5">
            {sections.map((sec, idx) => (
              <div key={sec.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 flex items-center justify-between">
                <div>
                  <div className="font-bold text-black text-[13px]">{sec.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Component Model: {sec.type}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveSection(idx, 'up')} className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded hover:bg-zinc-100 font-bold text-[9px]">▲</button>
                    <button onClick={() => moveSection(idx, 'down')} className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded hover:bg-zinc-100 font-bold text-[9px]">▼</button>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sec.status === 'Published' ? 'bg-emerald-100 text-emerald-950' : 'bg-zinc-150 text-zinc-650'}`}>{sec.status}</span>
                  <button onClick={() => handleToggleStatus(sec.id)} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Visibility</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Menus configuration */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">CMS Menu Navigation links</h3>
          <div className="space-y-3">
            {[
              { title: 'Main Header Navigation', links: 'Home, Shop, Mystery Box, Customize Case, Contact' },
              { title: 'Footer Policy Links', links: 'Privacy Policy, Terms of Service, Return & RMA Policy' },
              { title: 'Mobile Account Menu Drawer', links: 'Orders Tracker, Wishlist, Account Info, Rewards' }
            ].map((menu, idx) => (
              <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1">
                <div className="font-bold text-black">{menu.title}</div>
                <div className="text-[10px] text-zinc-500 font-semibold leading-relaxed">{menu.links}</div>
                <button onClick={() => toast.success(`${menu.title} navigation settings drawer opened!`)} className="text-[10px] font-bold text-indigo-600 hover:underline mt-1.5 block cursor-pointer">
                  Configure Links →
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
