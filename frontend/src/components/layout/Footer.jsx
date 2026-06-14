import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#f8f8f8] pt-16 pb-8 px-6 border-t border-[var(--color-outline-variant)]">
      {/* Brand */}
      <div className="flex items-center gap-2 font-black text-2xl tracking-tighter mb-4 text-[var(--color-on-surface)] font-display">
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
        COVERSCART
      </div>
      <p className="text-sm text-gray-500 mb-12 leading-relaxed max-w-xs">
        Premium covers for every device. Protect your tech with style since 2020.
      </p>

      {/* Quick Links */}
      <div className="border-t border-[var(--color-outline-variant)] py-6">
        <p className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-wider mb-6">
          Quick Links
        </p>
        <ul className="space-y-5 text-sm text-gray-500 font-medium">
          {[
            { label: 'Shop All Cases', to: '/shop' },
            { label: '🔥 Limited Edition', to: '/limited' },
            { label: '✨ Custom Cases', to: '/customize' },
            { label: '🎁 Mystery Pouch', to: '/mystery' },
            { label: 'Community', to: '/community' },
            { label: 'Rewards & XP', to: '/rewards' },
          ].map((item) => (
            <li key={item.label}>
              <Link to={item.to} className="hover:text-[var(--color-secondary)] transition-colors">{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Help & Support */}
      <div className="border-t border-[var(--color-outline-variant)] py-6">
        <p className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-wider mb-6">
          Help &amp; Support
        </p>
        <ul className="space-y-5 text-sm text-gray-500 font-medium">
          {['Track Order', 'FAQ', 'Contact Us', 'Returns & Warranty'].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-[var(--color-secondary)] transition-colors">{item}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 border-t border-[var(--color-outline-variant)] pt-8 text-center">
        <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">
          © {new Date().getFullYear()} CoverScart. All rights reserved.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="mt-6 flex items-center gap-2 mx-auto text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-[var(--color-secondary)] transition-colors"
        >
          Back to top <span className="material-symbols-outlined text-xs">arrow_upward</span>
        </button>
      </div>
    </footer>
  );
}
