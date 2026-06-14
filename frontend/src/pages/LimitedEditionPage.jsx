import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BottomNav from '../components/layout/BottomNav';
import toast from 'react-hot-toast';

// ─── Data ────────────────────────────────────────────────────────────────────

const LIVE_DROPS = [
  {
    id: 'ld-042',
    edition: '#042',
    name: 'Neon Topography',
    price: '₹7,399',
    soldPct: 96,
    stockLeft: 12,
    timerHours: 4,
    timerMins: 22,
    timerSecs: 11,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCja8KkLkjZEzypW_CbFhtDjFKZ-XDIBRDhyyXyvLepBOvkUsPXquFch4ne4iY-oYOQ8k-e8KktSB1j4oEwRrp3zs0W-gIKlB3tr6D1P_KsQ7u-CXyJ7yHDiXPnrejgyUMgmg0ED4C9_ULqMyOHukCmz3_PCvEavU0MNmZPeQXrxueKtkxgaHvcZ3jTub41Y5Z49RsQ8VeSgz5iAA5QkbLfvc38U2f9npLtE-juCReBoqq4akdMewHBb95zaTWAMITDB4--MJ6FzJrA',
  },
];

const UPCOMING_DROPS = [
  {
    id: 'ld-043',
    edition: '#043',
    name: 'Carbon Cobalt',
    dropIn: '48:00:00',
    desc: 'The Fusion of Resilience and Aesthetics. October 24th, 10:00 AM IST.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD89nzErgqOooFuz2X_cK7qfY1f_ug6_5rI2JAUKlBfzq9LtbHyl5Ui95fUzmZz4TYG3QLWyLuubEfb8mpvaduD_7r14xAEa0BKu-ZOXckm1ppu7iA6lwkkBEK9NFNLExkJ0JnvYkFCzu4sUNvE6jCA1LvMpR2_2FbcdoxbOilMiQ3GXNhc1rNEfIezGUYLC-WATnWOIKoXiCBQE4pmeKaMvAqj3DvEGF1R7REwgBfeyYWYz0HwR_t4UVxPA5ZUws8xjTZPScf0ThMX',
  },
];

const DROP_RULES = [
  {
    icon: 'check_circle',
    title: 'One-Time Release:',
    body: 'Designs are never reprinted or restocked. Ever.',
  },
  {
    icon: 'check_circle',
    title: 'Serialized Authentication:',
    body: 'Each case features a unique digital certificate.',
  },
  {
    icon: 'check_circle',
    title: 'Priority Access:',
    body: 'Previous collectors receive a 1-hour head start.',
  },
  {
    icon: 'check_circle',
    title: 'Permanent Archive:',
    body: 'Sold-out designs enter the Vault forever.',
  },
];

const TRUST_BADGES = [
  { icon: 'verified', label: 'ONE-TIME RELEASE' },
  { icon: 'inventory_2', label: 'LIMITED QUANTITY' },
  { icon: 'workspace_premium', label: 'COLLECTOR SERIES' },
  { icon: 'lock', label: 'PERMANENT RETIREMENT' },
];

const ARCHIVE = [
  {
    id: 'arc-012',
    name: 'Rustic Heritage',
    edition: 'Ed. #012',
    released: 'Released Mar 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ8uiQBPFB4lJ9y9qDWH2mWb-G9_1qxpe9yUrAI4lTO-kzy_8zRZJs70uS9sx3qUriHx6mfxn0NxsGTZLRFg4pXzX1TRHsDFb7XvtoP0w7qeY-yEMvFrrZOVUIVuankykSgn6nTKXs21q_1xM5a_gP3ic5KZhW95YmlEYl1YKZaq6x-JDxw6Am7l6818-wFxogk5NE87hSsnEhw2UNBynaexK6gkwSdPxxqvzu3DzFd02xhvUDZju5Rz44SjGaTECCpRqH3N8SAEY5',
  },
  {
    id: 'arc-028',
    name: 'Mono Geometric',
    edition: 'Ed. #028',
    released: 'Released Jun 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYZ9kKH8lGGCifvz1tyuk8hOuuC-1nnFyb8TSRyHeYGMURcVwxpQng7S_-Lr3JU1-1T-8ruc_jw-U7nGowfJxuXM-iRQZ2ByXxoaQondomAEE1tKcIT177SZHr_odTeTGCzkSq6pe5CnVn8iqdP1PpHXF0-3EULD4kDD0A_wiSgmdc85CG-raQu1bR0NFgeuAdhMovn0L9D8z_IX9mjFDhVLAOVEnAB_AyMpJjui8KIIpykre0PXh_91g8cYKSVuQWp9s5vuSFmPdg',
  },
  {
    id: 'arc-035',
    name: 'Circuit Glow',
    edition: 'Ed. #035',
    released: 'Released Aug 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3m_5JHO4tRC5p9iDsbVvMqZObQyHv7pKPXVYUzaJPcBXT71-lfo-7Zz22kwu3JgNXxmBJbqun3IfwGTwVR57DlSkJrRdmCr8AFHNChGLxHqLjzagN7aFoxc0gDM3ECihPIQwACMDQ6kO942KgwaCLlcYefdCgNf4FFtPhPRWE6ASquIu1GHROXUUZ44iOEWtODner7nkTsYFn0OMT3NX3sbNQGmsxN75hWUCL_BJxCc4OUMgx_mzv5p-FlFiKb0tsmtGhBXAvmX6',
  },
  {
    id: 'arc-039',
    name: 'Sahara Minimal',
    edition: 'Ed. #039',
    released: 'Released Sep 2024',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCvTSWl1pWJW7T0GM7GUJub9WnfGwKvCbUHd0jk0TLsWi5Dd4OgjL9va237R9dXzljXWnNfR0qT7RoG6XJ1WBwnBUenfdX-_ePvJGEVA4BAJcPEnXQul6pR_jAQCLOn8EC-nF8X-xWpCjtuIuQ68ser4CLJDbXkyE0C-8eYo9TJUAgA9Cwd4O2On5Zw8RwXVuIlkG_zOHHydXBLk99lWPoHChGo9xExfmyGa5VRHqX661rmPNKe_tuIFjweV_GDzNNI8rx_lJNEJMv6',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function LiveDropCard({ drop }) {
  const [time, setTime] = useState({
    h: drop.timerHours,
    m: drop.timerMins,
    s: drop.timerSecs,
  });

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

  return (
    <div className="group relative bg-[#f6f2f7] rounded-2xl overflow-hidden flex flex-col border border-[#cfc4c5]/30 transition-all hover:border-[#4648d4]/50 hover:shadow-xl">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-[#e4e1e6] overflow-hidden">
        <img
          src={drop.image}
          alt={drop.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Badges */}
        <div className="absolute top-4 left-4 bg-[#4648d4] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Live Now
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#111] text-xs font-bold px-3 py-1 rounded-full">
          Ed. {drop.edition}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-[#111] font-headline">{drop.name}</h3>
          <span className="text-[#4648d4] font-black text-lg">{drop.price}</span>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-2 text-[#4c4546] text-xs font-semibold">
          <span className="material-symbols-outlined text-base leading-none">schedule</span>
          <span className="font-mono">
            {pad(time.h)}h {pad(time.m)}m {pad(time.s)}s left
          </span>
        </div>

        {/* Stock bar */}
        <div className="mt-auto pt-3">
          <div className="flex justify-between text-[11px] font-bold mb-1.5">
            <span className="text-red-600">Only {drop.stockLeft} Left</span>
            <span className="text-[#4c4546]">{drop.soldPct}% Sold</span>
          </div>
          <div className="w-full h-1.5 bg-[#cfc4c5]/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4648d4] rounded-full transition-all"
              style={{ width: `${drop.soldPct}%` }}
            />
          </div>
          <button
            onClick={() => toast.success(`${drop.name} added to collection!`)}
            className="w-full mt-4 bg-[#111] text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-[#4648d4] transition-colors"
          >
            Add to Collection
          </button>
        </div>
      </div>
    </div>
  );
}

function UpcomingDropCard({ drop }) {
  const [notified, setNotified] = useState(false);
  return (
    <div className="group relative bg-[#f6f2f7] rounded-2xl overflow-hidden flex flex-col border border-[#cfc4c5]/30">
      <div className="relative aspect-[4/5] bg-[#e4e1e6] overflow-hidden">
        <img
          src={drop.image}
          alt={drop.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        {/* Blur overlay with countdown */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center px-6">
          <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase mb-2">DROPS IN</span>
          <div className="text-white text-4xl font-black tabular-nums font-mono">{drop.dropIn}</div>
        </div>
        <div className="absolute top-4 left-4 bg-white text-[#111] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Coming Soon
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#111] text-xs font-bold px-3 py-1 rounded-full">
          Ed. {drop.edition}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-grow">
        <h3 className="text-lg font-bold text-[#111] font-headline">{drop.name}</h3>
        <p className="text-[#4c4546] text-sm">{drop.desc}</p>
        <button
          onClick={() => {
            setNotified(true);
            toast.success('You\'ll be notified when it drops!');
          }}
          className={`w-full mt-auto py-3 rounded-xl font-bold text-sm border transition-all ${
            notified
              ? 'bg-[#4648d4] text-white border-[#4648d4]'
              : 'bg-[#cfc4c5]/20 text-[#4c4546] border-[#cfc4c5]/50 hover:bg-[#111] hover:text-white hover:border-[#111]'
          }`}
        >
          {notified ? '✓ Notified' : 'Notify Me'}
        </button>
      </div>
    </div>
  );
}

function ArchiveCard({ item }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square bg-[#f0edf1] rounded-xl overflow-hidden group cursor-pointer">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover grayscale contrast-110 opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
        />
        {/* SOLD OUT stamp */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="text-[#111] text-[11px] font-black tracking-widest border-2 border-[#111]/40 px-3 py-1 rotate-[-15deg] opacity-60 group-hover:opacity-0 transition-opacity"
          >
            SOLD OUT
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xs font-bold px-1">
        <span className="text-[#111]">{item.name}</span>
        <span className="text-[#4c4546]">{item.edition}</span>
      </div>
      <span className="text-[10px] text-[#4c4546] uppercase px-1 tracking-wider">{item.released}</span>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function LimitedEditionPage() {
  const navigate = useNavigate();
  const heroImgRef = useRef(null);
  const [email, setEmail] = useState('');

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEarlyAccess = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('🎉 Early access secured! Watch your inbox.');
    setEmail('');
  };

  return (
    <div className="overflow-x-hidden bg-[#fbf8fc] text-[#1b1b1e]">
      <Header />

      <main className="pt-16 pb-24">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative w-full h-[85vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-[#111]">
          <div className="absolute inset-0 z-0">
            <img
              ref={heroImgRef}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhT5WnopNkPW6-mYWLGShKls5R1KWpmK4NXnHY4E-7sdfHEYy7zq3O7qN31R4_DAl4EcUsggbgwx8GO62W3VV0hqUef17c5pxoDP3JsOu9JnUMisAqIl_Y4R-iPMN1BOqAfu5Z0ZM84Jksv0-0Yg0kUzNzZpskhCUgtkhMAuONh0ie5xlL5CwXNr1k8sQ-RqDwo0658Da4jNtKNwQQofbeEaHlkBOt8g-CFuNRMVWHh9jiNSBahJAiEQYGs3vln9dFgHAKs1ALoDK5"
              alt="Limited Edition Hero"
              className="w-full h-full object-cover opacity-60 scale-110"
              style={{ willChange: 'transform' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
          </div>

          <div className="relative z-10 px-6 text-center max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#c0c1ff] uppercase mb-5 block animate-pulse">
              ✦ Exclusive Drop ✦
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight font-headline leading-tight">
              Limited Edition<br />Collection
            </h1>
            <p className="text-lg font-semibold text-white/90 mb-3 font-headline">
              Released Once. Never Repeated.
            </p>
            <p className="text-sm text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
              Every Limited Edition CoverScart case is produced for a single release only.
              Once the drop ends, the design is permanently archived and will never return.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => document.getElementById('live-drops')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-[#111] px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#4648d4] hover:text-white active:scale-95 transition-all shadow-2xl"
              >
                Explore Collection
              </button>
              <button
                onClick={() => navigate('/limited/browse')}
                className="border border-white/40 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-white/10 backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all"
              >
                Browse All Cases
              </button>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </section>

        {/* ── Trust Badges ─────────────────────────────────────────────── */}
        <section className="bg-[#f0edf1] py-6 border-y border-[#cfc4c5]/30">
          <div className="px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.label}
                className="text-center p-4 bg-white rounded-xl border border-[#cfc4c5]/20 flex flex-col items-center gap-2"
              >
                <span className="material-symbols-outlined text-[#4648d4]" style={{ fontSize: 32 }}>
                  {b.icon}
                </span>
                <span className="text-[10px] font-black tracking-[0.12em] text-[#111] uppercase leading-tight">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Live Drops ───────────────────────────────────────────────── */}
        <section id="live-drops" className="px-4 py-14">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-black tracking-[0.2em] text-[#4648d4] uppercase">
                Active Releases
              </span>
              <h2 className="text-3xl font-black tracking-tight text-[#111] font-headline mt-1">
                Live Drops
              </h2>
              <p className="text-[#4c4546] text-sm mt-1">
                Active releases currently available for purchase.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#4648d4] text-[11px] font-black bg-[#4648d4]/5 px-4 py-2 rounded-full border border-[#4648d4]/20">
              <span className="w-2 h-2 rounded-full bg-[#4648d4] animate-pulse" />
              SECURE YOURS NOW
            </div>
          </div>

          {/* Bento grid: live + upcoming + rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Live drop cards */}
            {LIVE_DROPS.map((drop) => (
              <LiveDropCard key={drop.id} drop={drop} />
            ))}

            {/* Upcoming drop cards */}
            {UPCOMING_DROPS.map((drop) => (
              <UpcomingDropCard key={drop.id} drop={drop} />
            ))}

            {/* Drop Rules card */}
            <div className="bg-[#111] p-7 rounded-2xl flex flex-col justify-center text-white md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-black text-[#c0c1ff] mb-6 font-headline">
                The Drop Rules
              </h3>
              <ul className="space-y-5">
                {DROP_RULES.map((rule, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-[#c0c1ff] mt-0.5 flex-shrink-0">
                      {rule.icon}
                    </span>
                    <span className="text-sm text-white/80 leading-relaxed">
                      <strong className="text-white">{rule.title}</strong> {rule.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Archive Vault ────────────────────────────────────────────── */}
        <section className="px-4 py-14 bg-white">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black tracking-[0.2em] text-[#4c4546] uppercase">
              Permanently Retired
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#111] font-headline mt-1">
              CoverScart Vault
            </h2>
            <p className="text-[#4c4546] text-sm mt-1">
              Never to be restocked. These editions are gone forever.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {ARCHIVE.map((item) => (
              <ArchiveCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* ── Collector Stats + Early Access ───────────────────────────── */}
        <section className="bg-[#111] text-white px-4 py-14 relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#4648d4]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#6063ee]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Stats side */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black font-headline">Collector Insights</h2>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: '42', label: 'Total Released' },
                  { val: '41', label: 'Total Archived' },
                  { val: '14m', label: 'Fastest Sell-Out' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <div className="text-2xl font-black text-[#c0c1ff]">{stat.val}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <blockquote className="p-5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                <p className="text-sm text-white/75 italic leading-relaxed">
                  "The scarcity isn't just marketing. It's our promise. We value the collectors
                  who join us on this journey of permanent design archive."
                </p>
              </blockquote>
            </div>

            {/* Early access form */}
            <div className="bg-white rounded-2xl p-7 text-[#111]">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#4648d4] uppercase">
                Collector Access
              </span>
              <h3 className="text-xl font-black mt-1 mb-2 font-headline">Early Access List</h3>
              <p className="text-sm text-[#4c4546] mb-6 leading-relaxed">
                Be the first to know when Edition #043 drops. Limited to 500 invitations only.
              </p>

              <form onSubmit={handleEarlyAccess} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black tracking-widest text-[#111] uppercase block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@scart.com"
                    className="w-full border border-[#cfc4c5] rounded-xl p-3.5 text-sm focus:border-[#4648d4] outline-none transition-colors bg-[#fbf8fc]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#111] text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#4648d4] transition-all active:scale-95"
                >
                  Secure Early Access
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
      <div className="h-16" />

      {/* Inline styles for grayscale filter */}
      <style>{`
        .grayscale { filter: grayscale(100%); }
        .contrast-110 { filter: grayscale(100%) contrast(1.1); }
        .grayscale-0 { filter: grayscale(0%) contrast(1); }
      `}</style>
    </div>
  );
}
