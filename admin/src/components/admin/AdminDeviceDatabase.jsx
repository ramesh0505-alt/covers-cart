import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminDeviceDatabase() {
  const [devices, setDevices] = useState([
    { id: 'dev-1', brand: 'Apple', model: 'iPhone 15 Pro Max', count: 18, status: 'Active' },
    { id: 'dev-2', brand: 'Apple', model: 'iPhone 15 Pro', count: 12, status: 'Active' },
    { id: 'dev-3', brand: 'Samsung', model: 'Galaxy S24 Ultra', count: 15, status: 'Active' },
    { id: 'dev-4', brand: 'Google', model: 'Pixel 8 Pro', count: 6, status: 'Active' }
  ]);

  const [artworks] = useState([
    { id: 'art-1', title: 'Neon Cyberpunk Street', category: 'Anime Designs', artist: 'Jane (Special Drop)', status: 'Approved' },
    { id: 'art-2', title: 'Water Breathing Giyu Effect', category: 'Anime Designs', artist: 'Licensed Partner', status: 'Approved' }
  ]);

  const [showDevModal, setShowDevModal] = useState(false);
  const [devForm, setDevForm] = useState({ brand: 'Apple', model: '', status: 'Active' });

  const handleAddDevice = (e) => {
    e.preventDefault();
    setDevices(prev => [...prev, { id: `dev-${Date.now()}`, ...devForm, count: 0 }]);
    toast.success('Device compatibility model added to database!');
    setShowDevModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Device Database & Artwork Library</h1>
          <p className="text-xs text-zinc-500 font-medium">Configure compatible phone models (Apple, Samsung, OnePlus, Nothing) and manage design artworks.</p>
        </div>
        <button onClick={() => { setDevForm({ brand: 'Apple', model: '', status: 'Active' }); setShowDevModal(true); }} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Add Phone Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Phone Compatibility Matrix */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Compatible Phone Models</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-150 text-[10px] uppercase font-bold text-zinc-400">
                  <th className="pb-2">Brand</th>
                  <th className="pb-2">Device Model</th>
                  <th className="pb-2 text-center">Associated Cases</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(d => (
                  <tr key={d.id} className="border-b border-zinc-100 last:border-b-0">
                    <td className="py-2.5 font-bold text-black">{d.brand}</td>
                    <td className="py-2.5 text-zinc-650 font-semibold">{d.model}</td>
                    <td className="py-2.5 text-center text-zinc-500 font-semibold">{d.count} designs</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artwork Library */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Artworks Library Catalog</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-150 text-[10px] uppercase font-bold text-zinc-400">
                  <th className="pb-2">Design Title</th>
                  <th className="pb-2">Collection Class</th>
                  <th className="pb-2">Artist / Partner</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map(art => (
                  <tr key={art.id} className="border-b border-zinc-100 last:border-b-0">
                    <td className="py-2.5 font-bold text-zinc-700">{art.title}</td>
                    <td className="py-2.5 text-indigo-650 font-semibold">{art.category}</td>
                    <td className="py-2.5 text-zinc-550 font-semibold">{art.artist}</td>
                    <td className="py-2.5 text-right font-bold text-emerald-600">{art.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {showDevModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-zinc-150 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h2 className="font-display font-extrabold text-sm text-black">Add Phone Model</h2>
              <button onClick={() => setShowDevModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddDevice} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Brand Name</label>
                <select 
                  value={devForm.brand}
                  onChange={(e) => setDevForm({ ...devForm, brand: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Google">Google</option>
                  <option value="Nothing">Nothing</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Device Model Title</label>
                <input 
                  type="text" 
                  value={devForm.model}
                  onChange={(e) => setDevForm({ ...devForm, model: e.target.value })}
                  placeholder="e.g. iPhone 17 Pro Max"
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowDevModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Register Model</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
