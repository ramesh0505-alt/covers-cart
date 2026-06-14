import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../lib/api';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatSlug.trim()) {
      toast.error('Please enter name and slug');
      return;
    }

    try {
      const res = await API.post('/categories', { name: newCatName, slug: newCatSlug });
      setCategories(prev => [...prev, res.data]);
      setNewCatName('');
      setNewCatSlug('');
      toast.success('Category added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add category');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/10">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-primary)]">Admin Categories</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">View and configure catalog filters.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="text-sm text-[var(--color-secondary)] hover:underline font-semibold cursor-pointer">
            Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* List panel */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-[var(--color-outline-variant)]/10 shadow-sm">
            <h3 className="text-lg font-bold mb-4 font-display">Storefront Categories</h3>
            {loading ? (
              <p className="text-sm text-[var(--color-outline)] animate-pulse">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-[var(--color-outline)]">No categories defined yet.</p>
            ) : (
              <div className="divide-y divide-[var(--color-outline-variant)]/30">
                {categories.map((c) => (
                  <div key={c.id || c.slug} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-[var(--color-primary)]">{c.name}</p>
                      <p className="text-xs text-[var(--color-outline)] font-mono">{c.slug}</p>
                    </div>
                    <span className="text-xs bg-[var(--color-surface-container)] text-[var(--color-on-surface)] py-1 px-2.5 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Creation Form */}
          <div className="bg-white p-6 rounded-2xl border border-[var(--color-outline-variant)]/10 shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-4 font-display">Add Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-outline)] uppercase mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Tough Armor"
                  className="w-full border border-[#cfc4c5] p-2 rounded text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-outline)] uppercase mb-1">Slug</label>
                <input 
                  type="text" 
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder="e.g. tough-armor"
                  className="w-full border border-[#cfc4c5] p-2 rounded text-sm outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg text-xs font-semibold"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
