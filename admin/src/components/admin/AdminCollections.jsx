import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminCollections() {
  const [collections, setCollections] = useState([
    { id: 'coll-1', name: 'Best Sellers', count: 18, revenue: 42500, visibility: 'Visible', banner: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=100&q=80', rules: 'Sales > 50 units' },
    { id: 'coll-2', name: 'Cyberpunk Collection', count: 8, revenue: 19400, visibility: 'Visible', banner: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=100&q=80', rules: 'Tag equals Neon' },
    { id: 'coll-3', name: 'Premium Collection', count: 12, revenue: 29000, visibility: 'Visible', banner: 'https://images.unsplash.com/photo-1581338604768-4cdd934a6074?auto=format&fit=crop&w=100&q=80', rules: 'Price > ₹1500' }
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', visibility: 'Visible', rules: '', banner: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setCollections(prev => prev.map(c => c.id === editing ? { ...c, ...form } : c));
      toast.success('Collection updated!');
    } else {
      const newColl = {
        id: `coll-${Date.now()}`,
        name: form.name,
        count: 0,
        revenue: 0,
        visibility: form.visibility,
        banner: form.banner || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=100&q=80',
        rules: form.rules
      };
      setCollections(prev => [...prev, newColl]);
      toast.success('Collection created successfully!');
    }
    setShowModal(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', visibility: 'Visible', rules: 'Manual', banner: '' });
    setShowModal(true);
  };

  const handleEdit = (c) => {
    setEditing(c.id);
    setForm({ name: c.name, visibility: c.visibility, rules: c.rules, banner: c.banner });
    setShowModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Product Collections</h1>
          <p className="text-xs text-zinc-500 font-medium">Create automated or manual product bundles based on tags, prices, and inventory rules.</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Add Collection
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-150 flex gap-4 items-center justify-between shadow-xs">
        <input 
          type="text" 
          placeholder="Search collections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Banner</th>
              <th className="p-4">Collection Name</th>
              <th className="p-4">Condition / Rules Engine</th>
              <th className="p-4 text-center">Products Count</th>
              <th className="p-4 text-right">Revenue Generated</th>
              <th className="p-4 text-center">Visibility</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="p-4">
                    <img src={c.banner} className="w-12 h-8 object-cover rounded border border-zinc-200" alt="" />
                  </td>
                  <td className="p-4 font-bold text-black">{c.name}</td>
                  <td className="p-4 font-mono text-zinc-500 text-[10px] bg-zinc-50/50">{c.rules}</td>
                  <td className="p-4 text-center font-semibold text-zinc-700">{c.count}</td>
                  <td className="p-4 text-right font-bold text-emerald-600">₹{c.revenue.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.visibility === 'Visible' ? 'bg-indigo-50 text-indigo-700' : 'bg-zinc-150 text-zinc-600'}`}>
                      {c.visibility}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(c)} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Edit</button>
                    <button onClick={() => { setCollections(prev => prev.filter(item => item.id !== c.id)); toast.success('Collection deleted!'); }} className="text-xs font-bold text-red-600 hover:underline cursor-pointer">Delete</button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-zinc-150 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h2 className="font-display font-extrabold text-sm text-black">
                {editing ? 'Edit Collection' : 'Create New Collection'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Collection Title</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Rules/Conditions Engine</label>
                <input 
                  type="text" 
                  value={form.rules}
                  onChange={(e) => setForm({ ...form, rules: e.target.value })}
                  placeholder="e.g. Tag equals Neon, Price > 1500"
                  className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono text-[11px]"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Banner Image URL</label>
                <input 
                  type="text" 
                  value={form.banner}
                  onChange={(e) => setForm({ ...form, banner: e.target.value })}
                  placeholder="https://example.com/banner.png"
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Visibility Status</label>
                <select 
                  value={form.visibility}
                  onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                >
                  <option value="Visible">Visible</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Save Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
