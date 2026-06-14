import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', active: true, isFeatured: false, seoTitle: '', seoDescription: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Failed to save category');
      
      toast.success('Category saved!');
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '', active: true, isFeatured: false, seoTitle: '', seoDescription: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to delete category');
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      active: category.active !== false,
      isFeatured: category.isFeatured === true,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || ''
    });
  };

  if (loading) return <div>Loading Categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', description: '', active: true, isFeatured: false, seoTitle: '', seoDescription: '' });
          }}
          className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-[#e0e0e0]">
            <h3 className="text-lg font-semibold mb-4">{editingCategory ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full border p-2 rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded" rows="3" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({...formData, active: e.target.checked})} />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} />
                  <span className="text-sm">Featured</span>
                </label>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-sm text-gray-500 mb-2">SEO Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">SEO Title</label>
                    <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({...formData, seoTitle: e.target.value})} className="w-full border p-2 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">SEO Description</label>
                    <textarea value={formData.seoDescription} onChange={(e) => setFormData({...formData, seoDescription: e.target.value})} className="w-full border p-2 rounded text-sm" rows="2" />
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#4648d4] text-white py-2 rounded font-medium mt-4">
                {editingCategory ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Featured</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e0e0]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#fbf8fc]">
                    <td className="px-6 py-4">
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs text-gray-500">/{cat.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${cat.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cat.active !== false ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {cat.isFeatured && <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Featured</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(cat)} className="text-[#4648d4] font-medium text-sm mr-4">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 font-medium text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
