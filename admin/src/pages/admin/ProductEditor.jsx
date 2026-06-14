import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    stock: 100,
    categoryId: '',
    images: [],
    deviceModels: [],
    materials: []
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to load product');
      const data = await res.json();
      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        salePrice: data.salePrice || '',
        stock: data.stock || 0,
        categoryId: data.categoryId || '',
        images: data.images || [],
        deviceModels: data.deviceModels || [],
        materials: data.materials || []
      });
    } catch (err) {
      toast.error(err.message);
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const url = isEditing ? `/api/products/${id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock, 10),
        deviceModels: typeof formData.deviceModels === 'string' ? formData.deviceModels.split(',').map(s=>s.trim()) : formData.deviceModels,
        materials: typeof formData.materials === 'string' ? formData.materials.split(',').map(s=>s.trim()) : formData.materials,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save product');
      toast.success(`Product ${isEditing ? 'updated' : 'created'}`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-[#7e7e7e]">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1c1c1c]">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={() => navigate('/admin/products')}
          className="text-sm font-medium text-[#7e7e7e] hover:text-[#1c1c1c]"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-xl border border-[#e0e0e0] shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#1c1c1c]">Basic Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-[#4c4546] mb-1">Title</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c4546] mb-1">Description</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4c4546] mb-1">Price (₹)</label>
              <input 
                required
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4c4546] mb-1">Compare at price (₹)</label>
              <input 
                type="number" 
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e0e0e0] shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-[#1c1c1c]">Inventory & Organization</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4c4546] mb-1">Stock Quantity</label>
              <input 
                required
                type="number" 
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4c4546] mb-1">Category</label>
              <select 
                required
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
              >
                <option value="" disabled>Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4c4546] mb-1">Device Models (comma separated)</label>
            <input 
              type="text" 
              name="deviceModels"
              value={Array.isArray(formData.deviceModels) ? formData.deviceModels.join(', ') : formData.deviceModels}
              onChange={handleChange}
              placeholder="iPhone 15 Pro, Samsung S24"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#4c4546] mb-1">Materials (comma separated)</label>
            <input 
              type="text" 
              name="materials"
              value={Array.isArray(formData.materials) ? formData.materials.join(', ') : formData.materials}
              onChange={handleChange}
              placeholder="Silicone, Glass"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-[#4648d4] focus:border-[#4648d4]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#4648d4] text-white rounded-lg font-medium hover:bg-[#3435b4] transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
