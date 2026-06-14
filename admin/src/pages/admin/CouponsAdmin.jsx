import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Coupon Management</h2>
        <button className="bg-[#4648d4] text-white px-4 py-2 rounded-lg font-medium">Create Coupon</button>
      </div>

      <div className="bg-white rounded-xl border border-[#e0e0e0] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8f9fa] border-b border-[#e0e0e0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Discount</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Usage</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e0e0]">
            {coupons.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No coupons found.</td></tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#fbf8fc]">
                  <td className="px-6 py-4 font-bold text-gray-800">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.usedCount} / {coupon.usageLimit ? coupon.usageLimit : '∞'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired/Inactive'}
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
