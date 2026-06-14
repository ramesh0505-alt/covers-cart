import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function MysteryAdmin() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      const res = await fetch('/api/mystery');
      const data = await res.json();
      setTiers(data);
    } catch (error) {
      toast.error('Failed to load mystery tiers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mystery Pouch Control Center</h2>
        <button className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Mystery Tier</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Tier Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Pool Size</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {tiers.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No mystery tiers configured.</td></tr>
            ) : (
              tiers.map((tier) => (
                <tr key={tier.id} className="hover:bg-[#fbf8fc]">
                  <td className="px-6 py-4 font-medium">{tier.name}</td>
                  <td className="px-6 py-4 text-sm">₹{tier.price}</td>
                  <td className="px-6 py-4 text-sm">{tier.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tier.products?.length || 0} products</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#4648d4] font-medium text-sm mr-4">Manage Pool</button>
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
