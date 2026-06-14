import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CollectionsAdmin() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections');
      const data = await res.json();
      setCollections(data);
    } catch (error) {
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Collections Management</h2>
        <button className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Collection</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Collection</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Products</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {collections.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No collections found.</td></tr>
            ) : (
              collections.map((col) => (
                <tr key={col.id} className="hover:bg-[#fbf8fc]">
                  <td className="px-6 py-4">
                    <div className="font-medium">{col.name}</div>
                    <div className="text-xs text-gray-500">/{col.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{col.products?.length || 0} items</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${col.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {col.active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4648d4] font-medium text-sm mr-4">Edit</button>
                    <button className="text-red-500 font-medium text-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
