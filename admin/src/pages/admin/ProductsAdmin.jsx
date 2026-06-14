import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(products.map(p => p.id)));
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.size} products?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      });
      if (!res.ok) throw new Error('Delete failed');
      toast.success(`${selectedIds.size} products deleted`);
      setSelectedIds(new Set());
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1c1c1c]">Products</h2>
        <div className="flex gap-3">
          {selectedIds.size > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
            >
              Delete Selected ({selectedIds.size})
            </button>
          )}
          <Link 
            to="/admin/products/new"
            className="px-4 py-2 bg-[#4648d4] text-white rounded-lg font-medium hover:bg-[#3435b4] transition"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#7e7e7e]">Loading...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e0e0] bg-[#fafafa]">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#4648d4] focus:ring-[#4648d4]"
                  />
                </th>
                <th className="p-4 text-xs font-semibold text-[#7e7e7e] uppercase tracking-wider">Product</th>
                <th className="p-4 text-xs font-semibold text-[#7e7e7e] uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-[#7e7e7e] uppercase tracking-wider">Inventory</th>
                <th className="p-4 text-xs font-semibold text-[#7e7e7e] uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-[#fafafa] transition-colors group">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#4648d4] focus:ring-[#4648d4]"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                      <div>
                        <Link to={`/admin/products/${product.id}`} className="font-semibold text-[#1c1c1c] hover:text-[#4648d4]">
                          {product.title}
                        </Link>
                        <div className="text-sm text-[#7e7e7e]">₹{product.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[#4c4546]">
                    {product.stock} in stock
                  </td>
                  <td className="p-4 text-sm text-[#4c4546]">
                    {product.category?.name || 'Uncategorized'}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#7e7e7e]">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
