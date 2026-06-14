import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import toast from 'react-hot-toast';

export default function AdminLayout({ activeSection, setActiveSection, children }) {
  const { user, logout } = useAuth();
  const { auditLogs, products, orders, customers } = useAdminData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Copilot state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Toggle sections tracking
  const [expandedGroups, setExpandedGroups] = useState({
    sales: true,
    catalog: true,
    mystery: true,
    customersGroup: true,
    communityGroup: false,
    marketing: false,
    inventory: false,
    shipping: false,
    payments: false,
    analytics: false,
    content: false,
    reports: false,
    usersGroup: false,
    integrations: false,
    system: false
  });

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Keyboard shortcut for Command Palette (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter command palette results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    
    const matchedProducts = products
      .filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .map(p => ({ type: 'Product', label: p.name, desc: `SKU: ${p.sku} | Price: ₹${p.price}`, section: 'products' }));
      
    const matchedOrders = orders
      .filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q))
      .map(o => ({ type: 'Order', label: o.id, desc: `${o.customerName} | Total: ₹${o.total}`, section: 'orders' }));
      
    const matchedCustomers = customers
      .filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .map(c => ({ type: 'Customer', label: c.name, desc: `${c.email} | Points: ${c.points}`, section: 'customers' }));

    return [...matchedProducts, ...matchedOrders, ...matchedCustomers].slice(0, 8);
  };

  const handleCopilotSubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    
    setTimeout(() => {
      let response;
      const promptLower = aiPrompt.toLowerCase();
      if (promptLower.includes('description') || promptLower.includes('write')) {
        response = `✨ **AI Draft Description:**\n"Elevate your mobile device protection with this designer artwork case. Constructed using precision-engineered dual-layer TPU, it features shock-absorbing corner pockets and beautiful high-definition scratchproof graphics. Optimized with strong magnetic alignment grids for perfect MagSafe accessories compatibility."`;
      } else if (promptLower.includes('forecast') || promptLower.includes('sales') || promptLower.includes('inventory')) {
        response = `📈 **AI Sales & Stock Forecast:**\n- Cyberpunk cases are experiencing 24% month-over-month growth. Recommend increasing wholesale raw sheet orders by 35% before the next Limited Drop.\n- Demon Slayer case inventory is critically low (8 units remaining) with high repeat customer checkout frequency. Projected stockout in 36 hours.`;
      } else {
        response = `🤖 **AI Copilot Insight:**\n"I checked your settings and metrics. Your average conversion rate is 3.12%, which is healthy. To boost repeat purchases, consider scheduling a custom push campaign to your 4 Gold Tier CRM contacts offering a 15% discount on the upcoming Mystery Drop."`;
      }
      setAiOutput(response);
      setAiLoading(false);
      toast.success('AI Suggestions generated!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] font-sans flex flex-col">
      {/* Universal Sticky Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface-container-lowest)] border-b border-[var(--color-outline-variant)]/30 px-6 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] cursor-pointer"
            title="Toggle Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg tracking-tight bg-black text-white px-2.5 py-1 rounded-lg">CS</span>
            <span className="font-display font-bold text-lg hidden sm:inline">CoverScart <span className="text-xs text-[var(--color-secondary)] font-normal border border-[var(--color-secondary)]/30 rounded px-1.5 py-0.5 ml-1">Enterprise Admin</span></span>
          </div>
        </div>

        {/* Global Search trigger bar */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div 
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/20 px-3.5 py-1.5 rounded-xl text-sm text-[var(--color-on-surface-variant)] flex items-center justify-between cursor-pointer hover:border-[var(--color-outline-variant)]/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span>Quick command palette...</span>
            </div>
            <kbd className="bg-[var(--color-surface-container-highest)] px-2 py-0.5 rounded text-[10px] font-bold">Ctrl K</kbd>
          </div>
        </div>

        {/* Right header buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
          >
            <span className="animate-pulse font-bold">✨ AI Copilot</span>
          </button>

          <button 
            onClick={() => setNotifPanelOpen(true)}
            className="p-2 rounded-xl hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] relative cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full"></span>
          </button>

          <div className="h-6 w-px bg-[var(--color-outline-variant)]/30 mx-1"></div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-display font-bold text-sm">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold">{user?.name || 'Ramesh Admin'}</div>
              <div className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wider font-semibold">Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Collapsible Sidebar */}
        <aside 
          className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-[var(--color-surface-container-lowest)] border-r border-[var(--color-outline-variant)]/30 flex flex-col transition-all duration-300 overflow-hidden select-none shrink-0 z-30`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 hide-scrollbar">
            
            {/* Dashboard Overview */}
            <button 
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeSection === 'dashboard' ? 'bg-black text-white' : 'hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface)]'}`}
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
                <span>Dashboard Overview</span>
              </div>
            </button>

            {/* Sales Group */}
            <div>
              <button 
                onClick={() => toggleGroup('sales')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>Sales</span>
                <span className="text-[10px]">{expandedGroups.sales ? '▼' : '►'}</span>
              </button>
              {expandedGroups.sales && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'whatsapp-orders', label: 'WhatsApp Orders' },
                    { id: 'orders', label: 'All Orders' },
                    { id: 'draft-orders', label: 'Draft Orders' },
                    { id: 'returns', label: 'Returns & RMAs' },
                    { id: 'refunds', label: 'Refunds' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

             {/* Catalog Group */}
            <div>
              <button 
                onClick={() => toggleGroup('catalog')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>Catalog</span>
                <span className="text-[10px]">{expandedGroups.catalog ? '▼' : '►'}</span>
              </button>
              {expandedGroups.catalog && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'products', label: 'Products' },
                    { id: 'categories', label: 'Categories' },
                    { id: 'collections', label: 'Collections' },
                    { id: 'limited-editions', label: 'Limited Editions' },
                    { id: 'daily-drops', label: 'Daily Drops' },
                    { id: 'custom-cases', label: 'Custom Case Builder' },
                    { id: 'devices-db', label: 'Devices Database' },
                    { id: 'search-merch', label: 'Search Merchandising' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mystery System Group */}
            <div>
              <button 
                onClick={() => toggleGroup('mystery')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>Mystery System</span>
                <span className="text-[10px]">{expandedGroups.mystery ? '▼' : '►'}</span>
              </button>
              {expandedGroups.mystery && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'mystery-dashboard', label: 'Mystery Dashboard' },
                    { id: 'mystery-pouches', label: 'Mystery Tiers' },
                    { id: 'spin-the-case', label: 'Spin The Case Wheel' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Customers Group */}
            <div>
              <button 
                onClick={() => toggleGroup('customersGroup')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>CRM & Rewards</span>
                <span className="text-[10px]">{expandedGroups.customersGroup ? '▼' : '►'}</span>
              </button>
              {expandedGroups.customersGroup && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'customers', label: 'Customers CRM' },
                    { id: 'loyalty-program', label: 'Loyalty Tiers' },
                    { id: 'subscriptions', label: 'Subscriptions' },
                    { id: 'referrals', label: 'Referral Leaderboard' },
                    { id: 'support-center', label: 'Support Center Tickets' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Community Content */}
            <div>
              <button 
                onClick={() => toggleGroup('communityGroup')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>Community & UGC</span>
                <span className="text-[10px]">{expandedGroups.communityGroup ? '▼' : '►'}</span>
              </button>
              {expandedGroups.communityGroup && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'community', label: 'Moderation Dashboard' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Operations (Inventory & Shipping) */}
            <div>
              <button 
                onClick={() => toggleGroup('inventory')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>Operations</span>
                <span className="text-[10px]">{expandedGroups.inventory ? '▼' : '►'}</span>
              </button>
              {expandedGroups.inventory && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'inventory-overview', label: 'Inventory & Stock Ledger' },
                    { id: 'shipping-zones', label: 'Shipping & Delivery Rules' },
                    { id: 'payments', label: 'Transactions & Gateways' },
                    { id: 'marketing-center', label: 'Marketing Campaigns' },
                    { id: 'analytics-center', label: 'Analytics Insights' },
                    { id: 'warehouse-workflows', label: 'Warehouse Pick Queue' },
                    { id: 'apps', label: 'Apps Marketplace' },
                    { id: 'media-lib', label: 'Media Library' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings & System */}
            <div>
              <button 
                onClick={() => toggleGroup('system')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] cursor-pointer"
              >
                <span>System & Admin</span>
                <span className="text-[10px]">{expandedGroups.system ? '▼' : '►'}</span>
              </button>
              {expandedGroups.system && (
                <div className="pl-3 mt-1 space-y-0.5">
                  {[
                    { id: 'settings', label: 'General & Gateway API' },
                    { id: 'homepage-builder', label: 'CMS Homepage Editor' },
                    { id: 'roles', label: 'Roles Permission Matrix' },
                    { id: 'audit-logs', label: 'Audit Change Logs' },
                    { id: 'notif-templates', label: 'Notification Templates' },
                    { id: 'seo-manager', label: 'SEO Management' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${activeSection === item.id ? 'bg-[var(--color-secondary)] text-white' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]'}`}
                    >
                      • {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="p-4 border-t border-[var(--color-outline-variant)]/35 flex justify-between items-center bg-[var(--color-surface-container-low)]">
            <button 
              onClick={() => {
                toast.success('Exited Admin Console');
                window.location.href = '/';
              }} 
              className="text-xs font-semibold text-[var(--color-on-surface-variant)] hover:underline cursor-pointer"
            >
              Exit Console
            </button>
            <button 
              onClick={logout} 
              className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 relative">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <footer className="bg-black text-[#848484] text-[10px] px-6 py-1.5 flex justify-between items-center border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Gateway Status: Razorpay/Stripe ONLINE</span>
        </div>
        <div>CoverScart Admin Engine v1.8 (Local Simulated Environment)</div>
      </footer>

      {/* Global Command Palette Modal */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 z-50 animate-fade-in">
          <div className="bg-[var(--color-surface-container-lowest)] w-full max-w-lg rounded-2xl shadow-2xl border border-[var(--color-outline-variant)]/20 overflow-hidden">
            <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[var(--color-outline)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search anything (e.g. Neon, Rohan, ORD-8942)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 outline-hidden text-sm"
                autoFocus
              />
              <button 
                onClick={() => { setCommandPaletteOpen(false); setSearchQuery(''); }}
                className="text-xs px-2 py-1 bg-[var(--color-surface-container)] rounded hover:bg-[var(--color-surface-container-high)] cursor-pointer"
              >
                Esc
              </button>
            </div>
            
            {/* Search results */}
            <div className="p-2 max-h-72 overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center text-xs text-[var(--color-on-surface-variant)]">
                  Type to start universal search across Catalog products, Sales Orders, and Customers...
                </div>
              ) : getSearchResults().length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--color-on-surface-variant)]">
                  No records match your query. Try searching for "neon", "Giyu", or "Rohan".
                </div>
              ) : (
                <div className="space-y-1">
                  {getSearchResults().map((res, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveSection(res.section);
                        setCommandPaletteOpen(false);
                        setSearchQuery('');
                        toast.success(`Navigated to ${res.type}`);
                      }}
                      className="w-full text-left p-3.5 rounded-xl hover:bg-[var(--color-surface-container)] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-black flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-[var(--color-surface-container-highest)] text-[9px] uppercase tracking-wider font-extrabold">{res.type}</span>
                          {res.label}
                        </div>
                        <div className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">{res.desc}</div>
                      </div>
                      <span className="text-xs text-[var(--color-secondary)]">Go →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Copilot Drawer */}
      {copilotOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[var(--color-surface-container-lowest)] shadow-2xl border-l border-[var(--color-outline-variant)]/30 z-50 flex flex-col animate-slide-in">
          <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <h2 className="font-display font-bold text-sm">CoverScart AI Copilot</h2>
            </div>
            <button 
              onClick={() => setCopilotOpen(false)}
              className="p-1 rounded-lg hover:bg-[var(--color-surface-container)] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-3 bg-[var(--color-surface-container-low)] rounded-xl text-xs space-y-2 leading-relaxed">
              <p className="font-semibold text-black">Try asking me to:</p>
              <ul className="list-disc list-inside space-y-1 text-[var(--color-on-surface-variant)]">
                <li><code className="bg-white px-1 py-0.5 rounded">Write a description</code> for MagSafe case</li>
                <li><code className="bg-white px-1 py-0.5 rounded">Forecast inventory</code> levels</li>
                <li>Analyze <code className="bg-white px-1 py-0.5 rounded">customer retention</code> campaign ideas</li>
              </ul>
            </div>

            {aiOutput && (
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-xs text-purple-900 whitespace-pre-line leading-relaxed shadow-xs">
                {aiOutput}
              </div>
            )}
          </div>

          <form onSubmit={handleCopilotSubmit} className="p-4 border-t border-[var(--color-outline-variant)]/30 bg-[var(--color-surface-container-low)] flex gap-2">
            <input 
              type="text" 
              placeholder="Ask AI Copilot..." 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 border border-[var(--color-outline-variant)]/40 p-2.5 rounded-xl text-xs bg-white focus:outline-hidden"
              disabled={aiLoading}
            />
            <button 
              type="submit" 
              className="px-3.5 py-2.5 bg-black text-white text-xs font-bold rounded-xl active:scale-95 cursor-pointer disabled:opacity-50"
              disabled={aiLoading}
            >
              {aiLoading ? 'Thinking...' : 'Send'}
            </button>
          </form>
        </div>
      )}

      {/* Right Notifications Alert Drawer */}
      {notifPanelOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-[var(--color-surface-container-lowest)] shadow-2xl border-l border-[var(--color-outline-variant)]/30 z-50 flex flex-col">
          <div className="p-4 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center">
            <h2 className="font-display font-bold text-sm">Real-time Activity Logs</h2>
            <button 
              onClick={() => setNotifPanelOpen(false)}
              className="p-1 rounded-lg hover:bg-[var(--color-surface-container)] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {auditLogs.slice(0, 10).map((log, i) => (
              <div key={i} className="p-3 bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)]/10 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[var(--color-secondary)] uppercase text-[9px] tracking-wider">{log.module}</span>
                  <span className="text-[9px] text-[var(--color-on-surface-variant)]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="font-semibold text-black">{log.action}</div>
                <div className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">{log.details}</div>
                <div className="text-[9px] text-[var(--color-outline)] mt-1">By {log.user}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
