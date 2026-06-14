import { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import toast from 'react-hot-toast';

export default function AdminCommunity() {
  const { ugcPosts, communityActions } = useAdminData();
  const [activeTab, setActiveTab] = useState('Photos');

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Community UGC & Reviews Moderation</h1>
        <p className="text-xs text-zinc-500 font-medium">Moderate customer photo unboxings, reviews ratings, and custom testimonials displayed on the homepage feed.</p>
      </div>

      <div className="flex gap-2 border-b border-zinc-150 pb-2">
        {['Photos', 'Videos', 'Reviews', 'Comments'].map(tab => (
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
              <th className="p-4">Type</th>
              <th className="p-4">Content / Comment</th>
              <th className="p-4 text-center">Likes</th>
              <th className="p-4 text-center">Featured Status</th>
              <th className="p-4 text-center">Moderation State</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ugcPosts
              .filter(p => p.type === activeTab || (activeTab === 'Reviews' && p.type === 'Review'))
              .map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="p-4 font-bold text-black">@{post.username}</td>
                  <td className="p-4">{post.type}</td>
                  <td className="p-4 text-zinc-500 max-w-sm truncate leading-relaxed">
                    {post.mediaUrl && <img src={post.mediaUrl} className="w-10 h-10 object-cover rounded mb-1.5 border" alt="" />}
                    "{post.comment}"
                  </td>
                  <td className="p-4 text-center font-bold text-zinc-700">{post.likes}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${post.featured ? 'bg-purple-100 text-purple-950' : 'bg-zinc-100 text-zinc-650'}`}>
                      {post.featured ? 'Featured on Home' : 'Standard'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${post.status === 'Approved' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => {
                        communityActions.toggleFeatured(post.id);
                        toast.success('Homepage display status changed!');
                      }}
                      className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                    >
                      Feature Toggle
                    </button>
                    <button 
                      onClick={() => {
                        communityActions.moderate(post.id, 'Approved');
                        toast.success('Post approved!');
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        communityActions.moderate(post.id, 'Rejected');
                        toast.error('Post rejected!');
                      }}
                      className="text-xs font-bold text-red-650 hover:underline cursor-pointer"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
