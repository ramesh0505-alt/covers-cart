import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('admin_portal_token') || localStorage.getItem('token');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'Published' });

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', description: '', status: 'Published' });
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setEditing(cat.id);
    setForm({ name: cat.name, description: cat.description, status: cat.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Category removed successfully!');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      status: form.status,
    };
    
    try {
      if (editing) {
        await fetch(`/api/categories/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(payload)
        });
        toast.success('Category updated!');
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(payload)
        });
        toast.success('Category created!');
      }
      fetchCategories();
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Product Categories</h1>
          <p className="text-xs text-zinc-500">Classify and organize store items to enable quick filtering and collection generation.</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Add Category
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-zinc-150 flex gap-4 items-center justify-between shadow-xs">
        <input 
          type="text" 
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Products Count</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <tr key={c.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="p-4 font-bold text-black">{c.name}</td>
                  <td className="p-4 font-mono text-zinc-500">{c.slug}</td>
                  <td className="p-4 text-zinc-500 truncate max-w-xs">{c.description}</td>
                  <td className="p-4 text-center font-semibold text-black">{c.count}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.status === 'Published' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEdit(c)} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="text-xs font-bold text-red-600 hover:underline cursor-pointer">Delete</button>
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
                {editing ? 'Edit Category' : 'Create New Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Description</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Publishing Status</label>
                <select 
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
