import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function LimitedDropsAdmin() {
  const [drops, setDrops] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem('admin_portal_token') || localStorage.getItem('token');

  const fetchDrops = async () => {
    try {
      const res = await fetch('/api/drops', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      setDrops(data);
    } catch (error) {
      toast.error('Failed to load drops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrops();
  }, []);

  const createDrop = async () => {
    try {
      const payload = {
        title: 'New Flash Drop',
        description: 'Automatic created drop',
        releaseDate: new Date().toISOString(),
        endDropDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
        productId: 'prod-1',
        stockLimit: 100
      };
      await fetch('/api/drops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload)
      });
      toast.success('Drop created!');
      fetchDrops();
    } catch (e) { toast.error('Error creating drop'); }
  };

  const archiveDrop = async (id) => {
    try {
      await fetch(`/api/drops/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: 'Archived' })
      });
      toast.success('Drop archived!');
      fetchDrops();
    } catch (e) { toast.error('Error archiving drop'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Limited Edition Drops</h2>
        <button onClick={createDrop} className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Limited Drop</button>
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
              drops.map((drop) => (
                <tr key={drop.id} className="hover:bg-[#fbf8fc]">
                  <td className="px-6 py-4 font-medium">{drop.title}</td>
                  <td className="px-6 py-4 text-sm">{drop.stockLimit}</td>
                  <td className="px-6 py-4 text-sm">{drop.soldCount || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(drop.releaseDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${drop.status === 'Archived' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'}`}>{drop.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => archiveDrop(drop.id)} className="text-red-500 font-medium text-sm">Archive</button>
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
