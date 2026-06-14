import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import NavDrawer from './NavDrawer';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <NavDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Announcement Bar */}
      <div className="bg-[#facc15] py-2 overflow-hidden border-b border-[var(--color-outline-variant)]">
        <div className="inline-flex gap-8 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-widest">
              🚀 GET FASTER DELIVERY ON PREPAID ORDERS. FREE SHIPPING. 🚀
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--color-outline-variant)] px-4 py-3 flex items-center justify-between">
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="w-11 h-11 flex items-center justify-center text-[var(--color-on-surface)] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 font-black text-xl tracking-tighter text-[var(--color-on-surface)] font-display">
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
          COVERSCART
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/search')}
            className="w-11 h-11 flex items-center justify-center text-[var(--color-on-surface)]"
            aria-label="Search"
          >
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
          <div className="relative">
            <button
              onClick={() => navigate('/cart')}
              className="w-11 h-11 flex items-center justify-center text-[var(--color-on-surface)]"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
            </button>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-[var(--color-secondary)] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
