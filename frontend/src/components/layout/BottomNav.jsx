import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const NAV_ITEMS = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Shop', icon: 'storefront', to: '/shop' },
  { label: 'Limited', icon: 'auto_awesome', to: '/limited' },
  { label: 'Profile', icon: 'person', to: '/account' },
];

export default function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[var(--color-outline-variant)] flex justify-around items-center py-3 px-2 z-[90]">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex flex-col items-center gap-1 relative ${
              active ? 'text-[var(--color-secondary)]' : 'text-[var(--color-on-surface-variant)]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[8px] font-bold uppercase">{item.label}</span>
            {item.badge && totalItems > 0 && (
              <span className="absolute -top-1 right-0 bg-[var(--color-secondary)] text-white text-[9px] min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
