import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function BannersAdmin() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <button className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Banner</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Banner</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Location</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {banners.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No banners found.</td></tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-[#fbf8fc]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {banner.image ? (
                        <img src={banner.image} alt="banner" className="h-12 w-20 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-20 bg-gray-200 rounded"></div>
                      )}
                      <div>
                        <div className="font-medium">{banner.heading || 'No Heading'}</div>
                        <div className="text-xs text-gray-500">{banner.link}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{banner.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {banner.active ? 'Active' : 'Draft'}
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
