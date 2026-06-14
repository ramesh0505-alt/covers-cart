import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// ─── Data ────────────────────────────────────────────────────────────────────

const ALL_CASES = [
  {
    id: 'lc-014',
    badge: 'LIVE NOW',
    badgeColor: 'bg-[#4648d4]',
    number: 'LIMITED #014',
    name: 'Dragon Ember Edition',
    model: 'iPhone 15 Pro Max',
    price: 2999,
    stockLeft: 17,
    stockLabel: '⚡ 17 Left',
    stockColor: 'text-red-600',
    urgency: 'ENDING IN 12 HOURS',
    status: 'live',
    wishlisted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTM34j4HNhhTTCxL8zSerLGImxRnVEgXs_KcfPDcCaa5MSsEWb4aydI9k1EhmkFhkPIWrCl2SoNUqBCvQIBAB9wrGXPoBDQaKPWrFMZ6MDWAc65JjW6hcGAj3KrPFzLa-bR4uGCeA0OS86OtWrXfXmRFCgXEUjv0UF2tEe7HEQJDsKUrXyrOhV75yrcNUSfqvdKO6E7Sa_KAvDBBb62_o7sHFkzd_09s7ODGxxaHXwwx9awBthKddEv_G7fYJ1z-1IBCAOIX10uH6I',
  },
  {
    id: 'lc-001',
    badge: 'COLLECTOR',
    badgeColor: 'bg-[#111]',
    number: 'LIMITED #001',
    name: 'Cyber Samurai',
    model: 'iPhone 14 / 15 Series',
    price: 3499,
    stockLeft: 4,
    stockLabel: '⚡ 4 Left',
    stockColor: 'text-red-600',
    urgency: 'LOW STOCK',
    status: 'live',
    wishlisted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtnpVni0coNm590-llWa6eVD45ivQCOgzoi5_fXFBFIyhHoqKiEyo1nvaq3J3ViXOiylmO1l8AVttty89OhGvVzoREJInmb-gUaobQyZiGA1bLx54b-nGzDzHhaAuOVAblBEN_ViO-PGGMAMx2awr-J2bhAERvrvOTbwZrIYRvaCdVQtIyG7OBcWz5siptkNOXAIFd-s_e0A71C3_yojujvQG5Xt_xs8b9XfPPEHUKfz2iyvu919DfPwPziuGHrQU8MoBIfK4gKC2J',
  },
  {
    id: 'lc-003',
    badge: 'NEW DROP',
    badgeColor: 'bg-[#4648d4]',
    number: 'LIMITED #003',
    name: 'Neo Tokyo Zenith',
    model: 'Galaxy S24 Ultra',
    price: 2999,
    stockLeft: 80,
    stockLabel: '80 Available',
    stockColor: 'text-[#4648d4]',
    urgency: null,
    status: 'live',
    wishlisted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJMFIjGN3sADAeBMl3THQEfhC_TD92PoQJEHdcm_DQGcjuiH8Esq99zuNP9HwPlUMp_EiZcKpSr2_JqWrdDgL39xzxFH_B5qKyckefGRAuKDUXNbc6f9T2IimRdzmhtrIYd5qM2H7L8kmfk11MBqweuUQMqeNc0RkP2SN-RbPsisFPhUgUDZnKSBL_CS4RyqvpQn93fnRZK0R1qd40sg7YaLohxMObgOy-co0rWxNOsmncVwwOTb_PTlJ2MLkvDyAZidFfFKL2LBA_',
  },
  {
    id: 'lc-004',
    badge: 'CROWN SERIES',
    badgeColor: 'bg-[#111]',
    number: 'LIMITED #004',
    name: 'Ghost Armor Marble',
    model: 'All Models',
    price: 4999,
    stockLeft: 2,
    stockLabel: '⚡ 2 Left',
    stockColor: 'text-red-600',
    urgency: null,
    status: 'live',
    wishlisted: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvkHLgB3OhE85P4Hnxxgctd2lRo6e62GTY4c-DLV8QYeXVDWKIRiZmaCBi3zaBL-Dz0uKGUBhPPdb5tq8HbuA_woEJ4Iz2V8FCucgwnLhXAH-9j9Fx4jRaU96H-s5vbnkkOkmRY2XM6l980PAfji4MKBfQqaUhd1phT-yHdlVk6TXfopvm1YXvXzD_jOSwPIaB3nP9ZhrAPc8pOLJPyvIwPM8gqI1tX-LWKuibsnae8S5FPnrXoH3pZ0n0XTAqPmvsvp7jcrYdE_-q',
  },
];

const RETIRED = [
  {
    id: 'ret-013',
    name: 'Crimson Samurai',
    edition: 'Edition #013',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR5tmzstQXleNoB3aaoEwuv7E0VaB3zBnkt9qdTM9EfQZqXBRJ4d4SCHwz14ozSGpBBqOE4tY5ZGUfNhUuZHWGJa38gOznEozux4DzkvsxNQFEl8HCXgqcDbcOUUnXnxhmRthRWqhi478O5vt6SOgXaCNMVqiAwp-TgZCnIEIKLwSMLhWGaAbSnmzM-kZW1R6w7ew76IhaGAPKIBMStptUz05XPzva-o2vbiYakWaOrIlLP2CDjJ_pRuYGhxGqPdkOqsPZ8N8hSR-I',
    label: 'RETIRED',
  },
  {
    id: 'ret-012',
    name: 'Royal Marble',
    edition: 'Edition #012',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZqGD0ejNkFWMn91a4Xhthmd0BMn73N33RHuuiHDIUpa8n7I2YKhEbbPAnzMFZabDrYFzl4sS1-IXUfdayUV-0GY6E8n2akznoNPQhFmeZO7II5XVLxNwMgHijoRSF3jy2ZrmhYlIgPuSilJliO7PQVM2xFN3JCH5Vjr_-Bp3TUcItUWiaGLaAhjaGdRAl9iCbECJC4Ewh3ajWCTBV5Abu_PPoo6Pv3W93qHvfEWmMxZ4JkryZLMH5Wx7svFI_943Je_b763Jpq-BY',
    label: 'ARCHIVED',
  },
];

const FILTERS = ['All Drops', 'Live Now', 'Coming Soon', 'Archived'];

const WHY_LE = [
  {
    icon: 'verified',
    title: 'Produced Once Only',
    body: 'Each batch is uniquely numbered and strictly finite.',
  },
  {
    icon: 'block',
    title: 'No Restocks or Reproductions',
    body: 'Once they sell out, they are archived in our vault forever.',
  },
  {
    icon: 'military_tech',
    title: 'Exclusive Ownership',
    body: 'Rare collector value that grows over time.',
  },
];

// ─── Countdown ───────────────────────────────────────────────────────────────

function useCountdown(h, m, s) {
  const [time, setTime] = useState({ h, m, s });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(time.h)} : ${pad(time.m)} : ${pad(time.s)}`;
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function LimitedCard({ item, onWishlist, wishlisted }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Scroll-reveal
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="flex flex-col group">
      <div className="relative aspect-[3/4] bg-[#F4F4F5] rounded-xl overflow-hidden mb-3 shadow-sm">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <div className={`absolute top-2 left-2 ${item.badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full font-bold`}>
          {item.badge}
        </div>
        {/* Wishlist */}
        <button
          onClick={() => onWishlist(item.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{
              color: wishlisted ? '#ef4444' : '#111',
              fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button>
        {/* Urgency bar */}
        {item.urgency && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md text-white text-[10px] py-2 text-center font-bold">
            {item.urgency}
          </div>
        )}
      </div>

      <div className="px-1">
        <p className="text-[10px] font-bold text-[#4648d4] mb-1 tracking-widest">{item.number}</p>
        <h4
          className="text-[15px] font-bold leading-tight mb-1 text-[#111] cursor-pointer hover:text-[#4648d4] transition-colors"
          onClick={() => navigate(`/product/${item.id}`)}
        >
          {item.name}
        </h4>
        <p className="text-[12px] text-[#4c4546] mb-2">{item.model}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="font-black text-[#111]">₹{item.price.toLocaleString('en-IN')}</span>
          <span className={`font-bold text-[11px] ${item.stockColor}`}>{item.stockLabel}</span>
        </div>
        <button
          onClick={() => {
            addToCart({ id: item.id, title: item.name, price: item.price, images: [item.image] });
            toast.success(`${item.name} added to cart!`);
          }}
          className="w-full bg-[#111] text-white text-[11px] font-bold py-2.5 rounded-lg uppercase tracking-wider hover:bg-[#4648d4] transition-colors active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LimitedCasesPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All Drops');
  const [wishlists, setWishlists] = useState({});
  const countdown = useCountdown(2, 14, 36);

  const toggleWishlist = (id) => {
    setWishlists((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast(next[id] ? 'Added to wishlist ❤️' : 'Removed from wishlist 💔');
      return next;
    });
  };

  const filtered = ALL_CASES.filter((c) => {
    if (activeFilter === 'All Drops') return true;
    if (activeFilter === 'Live Now') return c.status === 'live';
    if (activeFilter === 'Coming Soon') return c.status === 'upcoming';
    if (activeFilter === 'Archived') return c.status === 'archived';
    return true;
  });

  return (
    <div className="overflow-x-hidden bg-[#fbf8fc] text-[#1b1b1e]">
      <Header />

      <main className="pt-20 pb-32">

        {/* ── Hero ────────────────────────────────────────────────── */}
        <section className="px-4 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="material-symbols-outlined text-[#4648d4]"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: 18 }}
            >
              auto_awesome
            </span>
            <span className="text-[10px] font-black text-[#4648d4] tracking-[0.2em] uppercase">
              Limited Edition
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#111] mb-2 font-headline leading-tight">
            Released Once.<br />Never Repeated.
          </h1>
          <p className="text-sm text-[#4c4546] max-w-[90%] leading-relaxed">
            Own designs that will never be released again. Once the drop ends, the design is permanently archived.
          </p>
        </section>

        {/* ── Exclusivity Banner ──────────────────────────────────── */}
        <section className="px-4 mb-10">
          <div
            className="rounded-2xl p-6 text-white shadow-xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #111111 0%, #333333 100%)' }}
          >
            {/* Bg icon */}
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: 80 }}
              >
                local_fire_department
              </span>
            </div>

            <div className="flex items-start gap-4 mb-5">
              <div className="bg-[#4648d4] rounded-full p-2 flex-shrink-0">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  local_fire_department
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black mb-1">One-Time Release Only</h3>
                <p className="text-sm text-white/80">
                  These cases are produced for a single drop only. No restocks, ever.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">
                  Current Drop Ends
                </p>
                <p className="text-xl font-black text-[#c0c1ff] font-mono">{countdown}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/60 uppercase font-bold tracking-widest mb-1">
                  Total Remaining
                </p>
                <p className="text-xl font-black text-white">412 Units</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filter Pills ────────────────────────────────────────── */}
        <div className="px-4 mb-6 overflow-x-auto flex gap-2 hide-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-[11px] font-black whitespace-nowrap uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 ${
                activeFilter === f
                  ? 'bg-[#111] text-white shadow-md'
                  : 'bg-[#f0edf1] text-[#4c4546] hover:bg-[#e4e1e6]'
              }`}
            >
              {f === 'Live Now' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4648d4] animate-pulse" />
              )}
              {f}
            </button>
          ))}
        </div>

        {/* ── Product Grid ────────────────────────────────────────── */}
        <section className="px-4 mb-12">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#4c4546]">
              <span className="material-symbols-outlined text-5xl mb-3 block opacity-30">inventory_2</span>
              <p className="text-sm font-semibold">No drops in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {filtered.map((item) => (
                <LimitedCard
                  key={item.id}
                  item={item}
                  onWishlist={toggleWishlist}
                  wishlisted={!!wishlists[item.id]}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Collector Status ────────────────────────────────────── */}
        <section className="px-4 mb-10">
          <div className="bg-[#f0edf1] rounded-2xl p-6 border border-[#cfc4c5]/40">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-black text-[#111]">Your Collector Status</h3>
                <p className="text-sm text-[#4c4546]">Level up for early drop access</p>
              </div>
              <div className="bg-[#e2e2e2] p-3 rounded-full">
                <span className="material-symbols-outlined text-[#111]">workspace_premium</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                { label: 'Cases Owned', value: '4 Cases', color: 'text-[#111]' },
                { label: 'Current Rank', value: 'Silver', color: 'text-[#4648d4]' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/60 p-3 rounded-xl border border-[#cfc4c5]/30">
                  <p className="text-[10px] uppercase font-black text-[#4c4546] mb-1">{stat.label}</p>
                  <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-[#4c4546]">
                <span>Silver Collector</span>
                <span>Next: Gold</span>
              </div>
              <div className="w-full bg-[#e4e1e6] h-2 rounded-full overflow-hidden">
                <div className="bg-[#4648d4] h-full rounded-full" style={{ width: '65%' }} />
              </div>
              <p className="text-center text-xs text-[#4c4546] mt-2">
                Buy 1 more case to reach Gold Rank
              </p>
            </div>
          </div>
        </section>

        {/* ── Why Limited? ────────────────────────────────────────── */}
        <section className="px-4 mb-10">
          <h3 className="text-xl font-black text-[#111] mb-4">Why Limited Editions?</h3>
          <div className="bg-white border border-[#cfc4c5]/40 rounded-2xl divide-y divide-[#cfc4c5]/30 overflow-hidden shadow-sm">
            {WHY_LE.map((item) => (
              <div key={item.title} className="p-4 flex gap-4 items-start">
                <span className="material-symbols-outlined text-[#4648d4] flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-[15px] font-bold mb-1">{item.title}</p>
                  <p className="text-sm text-[#4c4546]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Vault (Retired) ─────────────────────────────────── */}
        <section className="px-4 mb-10">
          <div className="flex justify-between items-end mb-5">
            <h3 className="text-xl font-black text-[#111]">The Vault</h3>
            <span className="text-[10px] font-black text-[#7e7576] uppercase tracking-widest">Sold Out</span>
          </div>

          <div className="grid grid-cols-2 gap-4 opacity-70">
            {RETIRED.map((item) => (
              <div key={item.id} className="grayscale">
                <div className="relative aspect-[3/4] bg-[#f0edf1] rounded-xl overflow-hidden mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="bg-black text-white px-3 py-1 text-[10px] rounded-full font-black">
                      {item.label}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#7e7576]">{item.name}</p>
                <p className="text-[11px] text-[#7e7576]">{item.edition}</p>
              </div>
            ))}
          </div>

          <button
            disabled
            className="w-full mt-6 py-3 border border-[#cfc4c5] text-[#7e7576] rounded-xl text-[11px] font-black uppercase tracking-widest cursor-not-allowed opacity-60"
          >
            View All Vault Archives
          </button>
        </section>

        {/* ── CTA back to Limited Home ─────────────────────────────── */}
        <section className="px-4">
          <button
            onClick={() => navigate('/limited')}
            className="w-full py-4 bg-[#4648d4] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#111] transition-colors active:scale-95"
          >
            ← Back to Limited Edition Hub
          </button>
        </section>

      </main>

      <Footer />
      <BottomNav />
      <div className="h-16" />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .grayscale { filter: grayscale(100%); }
      `}</style>
    </div>
  );
}
