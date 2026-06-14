import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function LimitedDropsAdmin() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch products that have LimitedDrops attached. For now, simulating fetch.
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Limited Edition Drops</h2>
        <button className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Limited Drop</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Artwork / Product</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Total Qty</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Sold</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Launch Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {drops.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No limited drops found.</td></tr>
            ) : (
              // Map drops here when API is ready
              null
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
