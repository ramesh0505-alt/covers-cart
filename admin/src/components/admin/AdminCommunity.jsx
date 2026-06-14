import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminCommunity() {
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('Pending'); // Changed to Approved/Pending

  const getToken = () => localStorage.getItem('admin_portal_token') || localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      // Use ?all=true to fetch unapproved reviews as well
      const res = await fetch('/api/reviews?all=true', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to fetch reviews');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleFeatured = async (id) => {
    try {
      await fetch(`/api/reviews/${id}/feature`, { 
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Homepage display status changed!');
      fetchReviews();
    } catch (e) {
      toast.error('Failed to toggle feature');
    }
  };

  const approveReview = async (id) => {
    try {
      await fetch(`/api/reviews/${id}/approve`, { 
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Review approved!');
      fetchReviews();
    } catch (e) {
      toast.error('Failed to approve review');
    }
  };

  const deleteReview = async (id) => {
    try {
      await fetch(`/api/reviews/${id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Review deleted!');
      fetchReviews();
    } catch (e) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(r => activeTab === 'Approved' ? r.isApproved : !r.isApproved);

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Community UGC & Reviews Moderation</h1>
        <p className="text-xs text-zinc-500 font-medium">Moderate customer photo unboxings, reviews ratings, and custom testimonials displayed on the homepage feed.</p>
      </div>

      <div className="flex gap-2 border-b border-zinc-150 pb-2">
        {['Pending', 'Approved'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold rounded-xl transition-all cursor-pointer ${activeTab === tab ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4 text-center">Featured Status</th>
              <th className="p-4 text-center">Moderation State</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="p-4 font-bold text-black">{post.reviewerName || 'Anonymous'}</td>
                  <td className="p-4">{post.rating} / 5</td>
                  <td className="p-4 text-zinc-500 max-w-sm truncate leading-relaxed">
                    {post.image && <img src={post.image} className="w-10 h-10 object-cover rounded mb-1.5 border" alt="" />}
                    "{post.comment}"
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${post.featured ? 'bg-purple-100 text-purple-950' : 'bg-zinc-100 text-zinc-650'}`}>
                      {post.featured ? 'Featured on Home' : 'Standard'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${post.isApproved ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
                      {post.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {post.isApproved && (
                      <button 
                        onClick={() => toggleFeatured(post.id)}
                        className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                      >
                        Feature Toggle
                      </button>
                    )}
                    {!post.isApproved && (
                      <button 
                        onClick={() => approveReview(post.id)}
                        className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    <button 
                      onClick={() => deleteReview(post.id)}
                      className="text-xs font-bold text-red-650 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr><td colSpan="6" className="p-6 text-center text-zinc-500">No {activeTab} reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
