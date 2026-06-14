import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_GROUPS = [
  {
    label: 'Shop',
    links: [
      { label: 'Home', to: '/', dot: true },
      { label: 'Shop All Cases', to: '/shop' },
      { label: 'Collections', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?filter=new' },
      { label: 'Best Sellers', to: '/shop?filter=best' },
    ],
  },
  {
    label: 'Experiences',
    links: [
      { label: 'Custom Case Creator', to: '/customize', badge: '✨' },
      { label: 'Limited Edition Cases', to: '/limited', badge: '🔥' },
      { label: 'Mystery Pouch', to: '/mystery' },
      { label: 'Daily Mystery Drops', to: '/mystery-drop' },
    ],
  },
  {
    label: 'Community & Rewards',
    links: [
      { label: 'Rewards & XP', to: '/rewards', icon: 'military_tech' },
      { label: 'Community', to: '/community', icon: 'group' },
      { label: 'Spin the Case', to: '/spin', icon: 'casino' },
    ],
  },
  {
    label: 'User',
    links: [
      { label: 'Wishlist', to: '/wishlist', icon: 'favorite_border' },
      { label: 'Orders', to: '/orders', icon: 'inventory_2' },
      { label: 'Profile', to: '/account', icon: 'person' },
      { label: 'Contact Us', to: '/contact', icon: 'chat_bubble_outline' },
    ],
  },
];

export default function NavDrawer({ isOpen, onClose }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-400 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-full max-w-[320px] bg-white z-[110] shadow-2xl flex flex-col overflow-hidden transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[var(--color-outline-variant)]">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 font-black text-xl tracking-tighter text-[var(--color-on-surface)]">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
            <span>COVERSCART</span>
          </Link>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] rounded-full transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-6 px-2" style={{ scrollbarWidth: 'none' }}>
          <div className="space-y-8">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="px-4">
                <h5 className="text-[10px] font-bold tracking-widest text-[var(--color-on-surface-variant)] uppercase mb-4 px-2">
                  {group.label}
                </h5>
                <nav className="space-y-1">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-3 rounded-xl font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-all active:scale-[0.98] text-sm"
                    >
                      <span className="flex items-center gap-3">
                        {link.icon && (
                          <span className="material-symbols-outlined text-base opacity-60">{link.icon}</span>
                        )}
                        {!link.icon && group.label === 'Shop' && (
                          <span className={`w-1.5 h-1.5 rounded-full ${link.dot ? 'bg-[var(--color-primary)]' : 'bg-transparent'}`} />
                        )}
                        {link.label}
                      </span>
                      {link.badge && <span className="text-[var(--color-secondary)] text-xs">{link.badge}</span>}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)]">
          {isAuthenticated ? (
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-on-surface-variant)] text-center">
                Signed in as <span className="font-semibold text-[var(--color-on-surface)]">{user?.name || user?.email}</span>
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-xl font-bold uppercase tracking-widest text-xs"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-center"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
