import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CommunityPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reveals'); // 'reveals' or 'feed'

  // Stateful posts for the community feed to support local liking
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Jordan Rivers',
      initials: 'JD',
      time: '2 hours ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1HX_07YdnvBQZM2fE0QbchKcboTusLNb1PfJQR-_cPl0_j84H_ziMNv8WUSkajyOgZVG40Jg0KTES7NO1wViHO8OHs3F7XAMnhxzwEQxruBvT25kWj_UxIIWjAQh8US9GemPUnaUuhDqmkxfYAou5ByMIJj81SpqAF3CHDvS8jjHtya1jIhWm-XsNF1RPRT44OPdpJtrrJ03oz8YjYLBjDhw2PBnbtONHkPADag2W71TOUEOH3HJHXFWSfIcOwEwyinxKE7U7Bt3L',
      likes: 1240,
      liked: false,
      comments: 48,
      text: 'Finally revealed the Elite Titanium series. This texture is insane. #RevealWall #EliteUnboxing',
      tags: ['Titanium Pro', 'Limited Edition'],
      label: 'ELITE REVEAL'
    },
    {
      id: 2,
      author: 'Aria Luna',
      initials: 'AL',
      time: '5 hours ago',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3UTjuZdzEr31BdvDYM_bc1nwR0JfOixqGSgQba6fcqGtxj2c2pL0or4-WiZHlQAq83oTgK7MWqUJaLTLwcX12C7dW9XM6lukPTmDKC_0tuEcpW6O5ED4GOcRol42F6L9CtwTPWd329XTwm5aMscF8MMTzgzJy-arxOloi8crvwNKodfK9QXTRJ-ESwBqegwOcXtiojl5OJIylUkq52KAfxwprvDTyXbm8X7GDMVXcDbC7jjq4YZzvwItS_YqOPCCxLkS2Rf711svw',
      likes: 842,
      liked: true,
      comments: 12,
      text: 'Matching my workspace vibes today. The frosted finish is so clean. ✨',
      tags: ['Frosted Series']
    }
  ]);

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleShareStory = () => {
    toast.success('Feature coming soon! Share your setup in the next update.', { icon: '📸' });
  };

  return (
    <div className="bg-[#fbf8fc] text-[#1b1b1e] font-sans selection:bg-[#e1e0ff] selection:text-[#07006c] min-h-screen pb-32">
      {/* Top App Bar with Tabs */}
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col bg-[#fbf8fc]/90 border-b border-[#cfc4c5]/30 backdrop-blur-md">
        <div className="flex justify-between items-center px-container-margin h-16">
          <button onClick={() => setDrawerOpen(true)} className="hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-black text-2xl">menu</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight text-black font-display">Reveal Wall</h1>
          <button onClick={() => navigate('/shop')} className="hover:opacity-70 transition-opacity active:scale-95 duration-150 cursor-pointer">
            <span className="material-symbols-outlined text-black text-2xl">search</span>
          </button>
        </div>
        <div className="flex px-container-margin border-t border-[#cfc4c5]/10">
          <button 
            onClick={() => setActiveTab('reveals')}
            className={`flex-1 py-3 text-xs tracking-wider uppercase font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'reveals' ? 'border-black text-black' : 'border-transparent text-[#4c4546]'
            }`}
          >
            Mystery Reveals
          </button>
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 text-xs tracking-wider uppercase font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'feed' ? 'border-black text-black' : 'border-transparent text-[#4c4546]'
            }`}
          >
            Community Feed
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32">
        {/* Community Hero / Call to Action */}
        <section className="px-container-margin mb-section-gap">
          <div className="relative overflow-hidden rounded-xl bg-black text-white p-8">
            <div className="relative z-10 max-w-xs">
              <h2 className="text-xl font-bold font-display mb-2 leading-tight">The Scart Collective</h2>
              <p className="text-xs opacity-90 mb-6">Every case tells a story. Join thousands of creators sharing their premium setup.</p>
              <button 
                onClick={handleShareStory}
                className="bg-white text-black px-6 py-3 rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                Share Your Story
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#4648d4] rounded-full blur-3xl opacity-30"></div>
          </div>
        </section>

        {/* Unboxing Videos (Horizontal Reels) */}
        <section className="mb-section-gap">
          <div className="px-container-margin flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-black font-display">Unboxing Videos</h3>
            <button onClick={() => toast('Reels filters coming soon')} className="text-xs font-semibold text-[#4648d4] uppercase tracking-wider cursor-pointer">View All</button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 px-container-margin">
            {/* Video Reel Card 1 */}
            <div className="flex-shrink-0 w-40 cursor-pointer group" onClick={() => toast.success('Playing reel by @tech_minimalist', { icon: '▶️' })}>
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#f6f2f7] mb-2 shadow-sm border border-[#cfc4c5]/10">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkHmvjqhOMuhlbMbSwBC4cB6OtWpXs4C3Zvswv1eXyPc8wJ49p3gSkfmruNRUke0jOCRmkkqsFLDm8gmZWEjdzx_m9-eODN3JksWlnIHJ5f90jZtPwFmldQPyW4mzfeQ60Qp_UugsmRDzwHKyZ1QDCkmSfrbJnE5JSKo6H0TqcHsUFzNBOiBYN8EpJDIyB3xgNPywhsnDEEIvwIE9oCxgNC96ApOMtfWjm6Op-5x3O26LzseJaipw-UN8LrJ65VB_AkQmEXkjlZ2Cr" alt="Matte Black Reveal" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-white text-xs">visibility</span>
                  <span className="text-white text-[10px] font-bold">12.4k</span>
                </div>
              </div>
              <p className="text-xs font-bold text-black truncate">Matte Black Reveal</p>
              <p className="text-[10px] font-semibold text-[#4c4546]">@tech_minimalist</p>
            </div>

            {/* Video Reel Card 2 */}
            <div className="flex-shrink-0 w-40 cursor-pointer group" onClick={() => toast.success('Playing reel by @sophie_designs', { icon: '▶️' })}>
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#f6f2f7] mb-2 shadow-sm border border-[#cfc4c5]/10">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgVxXFKTWcC18KsRpGyfvsaUOiDLNJaI3mhME3NXxziqDo8kKqEVgUUb2X83bjUjzyeECS9ABQzOo1vurZQPIbK1vYMPxcBIowffjdI6Vwcv2OwACSthiOowGhlEqFEAAjnrwaZ-0zCeiakxnvpbrnuYrHy9XtQLh8pukXxTEPyNAbbaICRjtnSkHBwZTLddRn2VOvvzNUOOaj4YkA9cHO-vRnZd_bSfuvA91Ux1jYgsr3ETvAN91kQoE17tLoEZ1SBa9TgOJjQ1dX" alt="Indigo Aesthetic" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-white text-xs">visibility</span>
                  <span className="text-white text-[10px] font-bold">8.9k</span>
                </div>
              </div>
              <p className="text-xs font-bold text-black truncate">Indigo Aesthetic</p>
              <p className="text-[10px] font-semibold text-[#4c4546]">@sophie_designs</p>
            </div>

            {/* Video Reel Card 3 */}
            <div className="flex-shrink-0 w-40 cursor-pointer group" onClick={() => toast.success('Playing reel by @eco_vibe', { icon: '▶️' })}>
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#f6f2f7] mb-2 shadow-sm border border-[#cfc4c5]/10">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDavDlvI6ajPlNdZktZEr80cX0SSFWCfl_IekHS7Qi1CBeUZBgYQ_hbVENUWORNymgh3VFYJCTNR6fTRkqPyRUg3pK4pR1XV-aR3-FAVpKUpbTBWk_oKwbwAsKzBP6GBWh5O3gKS1suKacmsk6X8-IPVmeXUrmJIsHNd0KOYiq5-OHVaKtNo2Lg17SvS6RCY7ZO_z2b560aHgQdl3kOTmBUmFuRM1vnnqtI0i13-iRLEIZZSO3ueuBEOXlx_byRyHF4DU9frGXxLgdG" alt="Sustainability Pack" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-white text-xs">visibility</span>
                  <span className="text-white text-[10px] font-bold">24k</span>
                </div>
              </div>
              <p className="text-xs font-bold text-black truncate">Sustainability Pack</p>
              <p className="text-[10px] font-semibold text-[#4c4546]">@eco_vibe</p>
            </div>
          </div>
        </section>

        {/* Mystery Pouch Reactions (Asymmetric Grid) */}
        <section className="mb-section-gap px-container-margin">
          <h3 className="text-base font-bold text-black font-display mb-4">Mystery Pouch Reactions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden bg-[#f6f2f7] border border-[#cfc4c5]/10 shadow-sm group cursor-pointer" onClick={() => toast('Full post view coming soon!')}>
              <img className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLcuhwZXfgAvjz8ke2_edzriKCshMorbE5LY1SgvFpMCoA4_eWBCXjHfSzHz5Vucnc7bSLtOG8mpdtbfU-JdBfN6_mOOdMRPFhwcK0dm8G5w5C4w12hFlIrYdZESgNgBUyxX4TDavMg_lIqC2rWJNkTUw5_RVg2YMJd7yxTkN4p29uOSVD8_3aFLWACGm2fxxO1A61-EctQQ0KNgk9qaXDbtF3ioZAPAf52vR2U4Fm03TR-eWYOMnQAj3AYljJG1cyZO6AEBA0zOUh" alt="Reaction 1" />
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm font-semibold">"Best blind buy ever!"</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-6 h-6 rounded-full bg-[#c0c1ff] flex items-center justify-center font-bold text-[8px] text-[#07006c]">JD</div>
                  <span className="text-white/80 text-[10px] font-semibold">@marky_mark</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f6f2f7] border border-[#cfc4c5]/10 shadow-sm group cursor-pointer" onClick={() => toast('Full post view coming soon!')}>
              <img className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1wXdtlrcDHhxRqdHbHQ3RYQrIrQJseFNAJdN55CwvqzuFVkfi6DgJCtUXlrPg9gilyDpJ5ronB6sWZNR4WiUNFA1gozZenq5TWGMNrzXbdahziaj7XpWAnYkd5jPIXWsRTGU23U6v2uRYGgOIvsBVuVyTnmTt0UID9ooEkKzhLlzwGNtrPnqAGJ2jR0yqrSLIkjGS-a4Mp529RY_U4D7y9kCJd6V1ZWysSUZeGx6jfdMVqhm1UAAi68aJ1rEHTYiFiLFtzEa0-UxF" alt="Reaction 2" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent">
                <span className="text-white text-[10px] font-bold">@aura_sky</span>
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f6f2f7] border border-[#cfc4c5]/10 shadow-sm group cursor-pointer" onClick={() => toast('Full post view coming soon!')}>
              <img className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy9WSGaTwWsjvXgjAaB86WFTUVbxezwFTNK0qUjkqHlpaBQzBAoiAI5TrWqKPl7AR_Rkgr7fYHYQra1SyFQz2SyEysPVF-7q9v9VjBedij2HtwcYrghsOxz7FFIqA38X5Cf0qeFonabSMSdNb4MBJYKveepmfd8xLsLAx-ULYz2cRS1UmBfGldnUn6ZK63P4H0deT2Ka65wmLqKoQuR32icpuluf7Zm19usniyH8xeX3MBaKKHihV_hYUuO4tNm1AX4_PgGTq2TwtI" alt="Reaction 3" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent">
                <span className="text-white text-[10px] font-bold">@urban_grid</span>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Photos (Social Feed Style) */}
        <section className="px-container-margin">
          <h3 className="text-base font-bold text-black font-display mb-4">Community Feed</h3>
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden border border-[#cfc4c5]/20 shadow-sm">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f6f2f7] flex items-center justify-center font-bold text-black">
                      {post.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black">{post.author}</p>
                      <p className="text-[10px] text-[#4c4546]">{post.time}</p>
                    </div>
                  </div>
                  <button onClick={() => toast('Reporting/Flagging options')} className="text-[#4c4546] hover:text-black cursor-pointer">
                    <span className="material-symbols-outlined text-lg">more_horiz</span>
                  </button>
                </div>
                <div className="aspect-square bg-[#f6f2f7] overflow-hidden">
                  <img className="w-full h-full object-cover" src={post.image} alt={post.author} />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${post.liked ? 'text-[#ba1a1a]' : 'text-[#4c4546] hover:text-[#ba1a1a]'}`}
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: post.liked ? "'FILL' 1" : "'FILL' 0" }}>
                        favorite
                      </span>
                      <span className="text-xs font-semibold">{post.likes.toLocaleString()}</span>
                    </button>
                    <button onClick={() => toast('Comments coming in next update')} className="flex items-center gap-1 text-[#4c4546] hover:text-black cursor-pointer">
                      <span className="material-symbols-outlined text-xl">chat_bubble_outline</span>
                      <span className="text-xs font-semibold">{post.comments}</span>
                    </button>
                    <button onClick={() => toast.success('Post saved!')} className="ml-auto text-[#4c4546] hover:text-black cursor-pointer">
                      <span className="material-symbols-outlined text-xl">bookmark_border</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#1b1b1e] leading-relaxed">
                    <span className="font-bold mr-1.5">{post.author}</span>
                    {post.text}
                  </p>
                  {post.tags && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-[#f6f2f7] text-[#4c4546] text-[10px] font-bold rounded uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={handleShareStory}
        className="fixed bottom-24 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex flex-col items-center justify-center z-40 active:scale-95 hover:opacity-90 transition-transform cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl text-white">add_a_photo</span>
        <span className="text-[8px] font-bold">REVEAL</span>
      </button>

      {/* Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col py-6 bg-white h-full w-80 rounded-r-xl shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 mb-8 flex justify-between items-center">
          <h2 className="text-lg font-bold text-black">Menu</h2>
          <button className="material-symbols-outlined cursor-pointer" onClick={() => setDrawerOpen(false)}>
            close
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/" className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">home</span>
            <span className="text-sm font-medium">Home Storefront</span>
          </Link>
          <Link to="/shop" className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-sm font-medium">Shop Catalog</span>
          </Link>
          <Link to="/account" className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-medium">My Account</span>
          </Link>
          <Link to="/wishlist" className="flex items-center gap-4 px-6 py-3 text-[#4c4546] hover:bg-[#f6f2f7] rounded-lg mx-2 transition-colors">
            <span className="material-symbols-outlined">favorite</span>
            <span className="text-sm font-medium">Wishlist</span>
          </Link>
          <Link to="/community" className="flex items-center gap-4 px-6 py-3 bg-[#e1e0ff] text-[#07006c] font-semibold rounded-lg mx-2">
            <span className="material-symbols-outlined">groups</span>
            <span className="text-sm">Community</span>
          </Link>
          <hr className="mx-6 my-4 border-[#cfc4c5]/30" />
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-6 py-3 text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors cursor-pointer text-left font-medium"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Log Out</span>
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-white/95 border-t border-[#cfc4c5]/20 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Home</span>
        </button>
        <button onClick={() => navigate('/shop')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">storefront</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Shop</span>
        </button>
        <button onClick={() => navigate('/cart')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Cart</span>
        </button>
        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center text-[#4c4546] hover:text-black transition-opacity cursor-pointer">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}

