import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Image,
  Layout,
  FolderTree,
  Layers,
  Calendar,
  Sparkles,
  Gift,
  ShoppingCart,
  Users,
  Ticket,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/media', label: 'Media Library', icon: Image },
  { to: '/homepage', label: 'Homepage Builder', icon: Layout },
  { to: '/categories', label: 'Categories', icon: FolderTree },
  { to: '/collections', label: 'Collections', icon: Layers },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/drops', label: 'Limited Drops', icon: Sparkles },
  { to: '/mystery', label: 'Mystery Pouch', icon: Gift },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/coupons', label: 'Coupons', icon: Ticket },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function navClass({ isActive }) {
  return [
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
    isActive
      ? 'bg-[#4648d4] text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  ].join(' ');
}

export default function AdminShell() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#fbf8fc] flex">
      {/* Sidebar */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-30 flex flex-col bg-white border-r border-gray-200 transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {sidebarOpen && (
            <div>
              <p className="font-extrabold text-[#4c4546] tracking-tight">CoverScart</p>
              <p className="text-[10px] uppercase tracking-wider text-[#4648d4] font-bold">Admin Portal</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          {sidebarOpen && user && (
            <div className="mb-3 px-2">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name || user.email}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{role}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={['flex-1 flex flex-col min-h-screen transition-all', sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'].join(' ')}>
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <p className="text-xs text-gray-400 ml-auto">
            admin.coverscart.com · Secure Admin Portal
          </p>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
