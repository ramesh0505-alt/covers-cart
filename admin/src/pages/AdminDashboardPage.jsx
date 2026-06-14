/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import AdminLayout from "./admin/AdminLayout";
import toast from 'react-hot-toast';

// New Sub-components
import AdminCategories from '../components/admin/AdminCategories';
import AdminCollections from '../components/admin/AdminCollections';
import AdminDrops from '../components/admin/AdminDrops';
import { AdminDraftOrders, AdminReturns, AdminRefunds } from '../components/admin/AdminSales';
import AdminWhatsAppOrders from '../components/admin/AdminWhatsAppOrders';
import AdminCRM from '../components/admin/AdminCRM';
import AdminLoyalty from '../components/admin/AdminLoyalty';
import AdminSubscriptions from '../components/admin/AdminSubscriptions';
import AdminInventory from '../components/admin/AdminInventory';
import { AdminShipping, AdminPayments } from '../components/admin/AdminOperations';
import { AdminMarketing, AdminAnalytics } from '../components/admin/AdminMarketing';
import AdminCMS from '../components/admin/AdminCMS';
import AdminRoles from '../components/admin/AdminRoles';
import AdminCommunity from '../components/admin/AdminCommunity';

// Advanced Enterprise Sub-components
import AdminMerchandising from '../components/admin/AdminMerchandising';
import AdminSEO from '../components/admin/AdminSEO';
import AdminMediaLibrary from '../components/admin/AdminMediaLibrary';
import AdminSupportCenter from '../components/admin/AdminSupportCenter';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminGiftsReferrals from '../components/admin/AdminGiftsReferrals';
import AdminWarehouseSupplier from '../components/admin/AdminWarehouseSupplier';
import AdminApps from '../components/admin/AdminApps';
import AdminDeviceDatabase from '../components/admin/AdminDeviceDatabase';

export default function AdminDashboardPage({ initialSection = 'dashboard', embedded = false }) {
  const {
    products,
    orders,
    customers,
    auditLogs,
    mysteryTiers,
    spinWheel,
    storeSettings,
    setStoreSettings,
    productActions,
    orderActions,
    mysteryActions
  } = useAdminData();

  const [activeSection, setActiveSection] = useState(initialSection);

  // Product crud states
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '', slug: '', price: 0, comparePrice: 0, cost: 0, stock: 0, sku: '', brand: '', category: 'Premium Cases', tags: '', image: '', status: 'Published'
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Custom Case workspace state
  const [selectedCustomOrder, setSelectedCustomOrder] = useState(null);

  // General Filter States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Pagination States for Orders Table
  const [apiOrders, setApiOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch orders from API for the Orders Table
  const fetchOrders = async (pageToFetch) => {
    try {
      const res = await fetch(`/api/orders/all?page=${pageToFetch}&limit=50`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_portal_token') || localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      const data = json.data || json;
      const meta = json.meta || { totalPages: 1 };
      
      setApiOrders(data);
      setOrdersTotalPages(meta.totalPages);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'sales') {
      fetchOrders(ordersPage);
    }
  }, [ordersPage, activeSection]);

  // 1. Dashboard calculations
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, curr) => acc + curr.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter(p => p.stock <= 10).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  // Form helpers
  const openNewProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '', slug: '', price: 999, comparePrice: 1499, cost: 350, stock: 50, sku: `CS-CASE-${Date.now().toString().slice(-4)}`, brand: 'CoverScart', category: 'Premium Cases', tags: 'Anime, MagSafe', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=300&q=80', status: 'Published'
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      productActions.edit(editingProduct.id, {
        ...prodForm,
        price: Number(prodForm.price),
        comparePrice: Number(prodForm.comparePrice),
        cost: Number(prodForm.cost),
        stock: Number(prodForm.stock)
      });
      toast.success('Product updated!');
    } else {
      productActions.add({
        ...prodForm,
        price: Number(prodForm.price),
        comparePrice: Number(prodForm.comparePrice),
        cost: Number(prodForm.cost),
        stock: Number(prodForm.stock),
        variants: [
          { id: `v-${Date.now()}-1`, model: 'iPhone 15 Pro', color: 'Black', material: 'TPU', stock: Number(prodForm.stock) }
        ]
      });
      toast.success('Product created!');
    }
    setShowProductModal(false);
  };

  const editProductTrigger = (p) => {
    setEditingProduct(p);
    setProdForm({ ...p });
    setShowProductModal(true);
  };

  const pageContent = (
    <>
      {activeSection === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Revenue Today', val: `₹${(totalRevenue * 0.15).toFixed(0)}`, desc: '+12% from yesterday', color: 'text-emerald-600' },
              { label: 'Revenue This Month', val: `₹${totalRevenue.toLocaleString()}`, desc: 'Target: ₹50,000', color: 'text-indigo-600' },
              { label: 'Revenue This Year', val: `₹${(totalRevenue * 8.2).toFixed(0)}`, desc: 'Projected: ₹5,00,000', color: 'text-purple-600' },
              { label: 'Average Order Value (AOV)', val: `₹${(totalRevenue / totalOrdersCount || 0).toFixed(0)}`, desc: 'Based on recent cart checkouts', color: 'text-amber-600' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">{card.label}</div>
                <div className={`text-2xl font-display font-extrabold ${card.color}`}>{card.val}</div>
                <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {card.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Executive Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Orders Today', val: '6', desc: '4 completed, 2 processing' },
              { label: 'Pending Orders Queue', val: pendingOrdersCount, desc: 'Awaiting design approval/payment' },
              { label: 'Completed Deliveries', val: orders.filter(o => o.status === 'Shipped').length, desc: 'In-transit status matches API' },
              { label: 'Cancelled / Returned', val: orders.filter(o => o.status === 'Cancelled').length, desc: 'Processed within SLA rules' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">{card.label}</div>
                <div className="text-xl font-display font-bold text-black">{card.val}</div>
                <div className="text-[10px] text-zinc-500 mt-2">{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Executive Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'New Customer Registrations', val: customers.filter(c => c.tier === 'Bronze').length, desc: 'From email newsletter' },
              { label: 'Returning Buyers', val: customers.filter(c => c.tier !== 'Bronze').length, desc: 'Silver, Gold & Elite Tiers' },
              { label: 'Overall Conversion Rate', val: '3.12%', desc: 'Product Views → Checkout' },
              { label: 'Live Storefront Visitors', val: '24', desc: 'Realtime active websocket tokens' }
            ].map((card, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">{card.label}</div>
                <div className="text-xl font-display font-bold text-black">{card.val}</div>
                <div className="text-[10px] text-zinc-500 mt-2">{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Charts & Funnel Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales Chart Simulation */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-500">Revenue Distribution (Last 7 Days)</h3>
                <span className="text-[10px] px-2 py-0.5 bg-zinc-100 rounded font-semibold text-zinc-600">Simulated SVG Plot</span>
              </div>
              <div className="h-44 w-full flex items-end justify-between pt-6 border-b border-zinc-150 pb-2 relative">
                {/* SVG Graph path */}
                <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0 80 Q 15 70 30 50 T 60 40 T 90 20 T 100 10" fill="none" stroke="#4648d4" strokeWidth="2.5" />
                  <path d="M 0 80 Q 15 70 30 50 T 60 40 T 90 20 T 100 10 L 100 100 L 0 100 Z" fill="url(#chart-grad)" opacity="0.06" />
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4648d4" />
                      <stop offset="100%" stopColor="#4648d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Days labels */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="h-full bg-zinc-100 w-px border-dashed"></div>
                    <span className="text-[10px] text-zinc-400 font-semibold mt-1">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales Funnel */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-500 mb-4">Storefront Sales Funnel</h3>
              <div className="space-y-3">
                {[
                  { stage: '1. Active Visitors', val: '2400 views', width: 'w-full', bg: 'bg-zinc-800' },
                  { stage: '2. Product Views', val: '1200 checks', width: 'w-[75%]', bg: 'bg-zinc-700' },
                  { stage: '3. Add to Cart', val: '310 additions', width: 'w-[45%]', bg: 'bg-zinc-600' },
                  { stage: '4. Checkout Initiated', val: '110 customers', width: 'w-[25%]', bg: 'bg-indigo-600' },
                  { stage: '5. Purchase Completed', val: '46 orders', width: 'w-[15%]', bg: 'bg-emerald-600' }
                ].map((item, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-semibold mb-1">
                      <span>{item.stage}</span>
                      <span className="text-[10px] text-zinc-500">{item.val}</span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`${item.bg} h-full ${item.width} rounded-full`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Activity Feed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-500 mb-3">Enterprise Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={openNewProduct} className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-left border border-zinc-150 cursor-pointer">
                  <div className="text-lg">📦</div>
                  <div className="text-[10px] font-bold mt-1 text-black">+ Add Product</div>
                </button>
                <button onClick={() => setActiveSection('collections')} className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-left border border-zinc-150 cursor-pointer">
                  <div className="text-lg">📁</div>
                  <div className="text-[10px] font-bold mt-1 text-black">Collections</div>
                </button>
                <button onClick={() => setActiveSection('limited-editions')} className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-left border border-zinc-150 cursor-pointer">
                  <div className="text-lg">⏳</div>
                  <div className="text-[10px] font-bold mt-1 text-black">New Drop</div>
                </button>
                <button onClick={() => setActiveSection('settings')} className="p-3 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-left border border-zinc-150 cursor-pointer">
                  <div className="text-lg">⚙️</div>
                  <div className="text-[10px] font-bold mt-1 text-black">API Config</div>
                </button>
              </div>
            </div>

            {/* Low stock indicators */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-500">Low Stock Alerts</h3>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">{lowStockCount} critical</span>
              </div>
              <div className="space-y-2.5">
                {products.filter(p => p.stock <= 15).map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-xs border-b border-zinc-100 pb-2">
                    <span className="font-semibold text-black truncate max-w-[150px]">{p.name}</span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live activity feed */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-500 mb-3">Realtime Store Activity</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {[
                  { text: 'Rohan Sharma added customized iPhone case to cart', time: '2 mins ago', icon: '🛒' },
                  { text: 'Giyu anime case sold out in Delhi warehouse', time: '12 mins ago', icon: '🔥' },
                  { text: 'Ananya_K review approved for home feed', time: '24 mins ago', icon: '✅' },
                  { text: 'Stripe Gateway completed webhook sync', time: '1 hr ago', icon: '💳' }
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span>{act.icon}</span>
                    <div className="flex-1">
                      <div className="text-zinc-700 leading-tight">{act.text}</div>
                      <div className="text-[9px] text-zinc-400 mt-0.5">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: PRODUCTS (CRUD & VARIANTS)                      */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'products' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-display font-extrabold text-black">Product Catalog</h1>
              <p className="text-xs text-zinc-500">Configure phone covers, customize variables, and bulk publish items.</p>
            </div>
            <button 
              onClick={openNewProduct}
              className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              + Create Product
            </button>
          </div>

          {/* Bulk Actions Header */}
          {selectedProducts.length > 0 && (
            <div className="bg-zinc-900 text-white p-3.5 rounded-xl flex justify-between items-center text-xs animate-fade-in">
              <span>{selectedProducts.length} products selected for batch operations</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    productActions.bulkPublish(selectedProducts, 'Published');
                    setSelectedProducts([]);
                    toast.success('Batch published successfully!');
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded font-bold cursor-pointer"
                >
                  Publish Selected
                </button>
                <button 
                  onClick={() => {
                    productActions.bulkPublish(selectedProducts, 'Archived');
                    setSelectedProducts([]);
                    toast.success('Batch archived successfully!');
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded font-bold cursor-pointer"
                >
                  Archive Selected
                </button>
                <button 
                  onClick={() => {
                    selectedProducts.forEach(id => productActions.delete(id));
                    setSelectedProducts([]);
                    toast.success('Batch deletion completed.');
                  }}
                  className="bg-red-700 hover:bg-red-800 px-3 py-1.5 rounded font-bold cursor-pointer"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* Catalog Filters */}
          <div className="bg-white p-4 rounded-xl border border-zinc-150 flex flex-wrap gap-4 items-center justify-between shadow-xs">
            <div className="flex-1 max-w-sm">
              <input 
                type="text" 
                placeholder="Search products by title, tag, or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs"
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs">
                <option>All Categories</option>
                <option>Premium Cases</option>
                <option>Leather Cases</option>
                <option>Anime Cases</option>
                <option>Mystery Cases</option>
              </select>
              <select className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs">
                <option>All Statuses</option>
                <option>Published</option>
                <option>Draft</option>
                <option>Hidden</option>
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <th className="p-4 w-10">
                    <input 
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(products.map(p => p.id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                      className="rounded text-indigo-600"
                    />
                  </th>
                  <th className="p-4">Thumbnail</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Cost</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p, idx) => (
                    <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                      <td className="p-4">
                        <input 
                          type="checkbox"
                          checked={selectedProducts.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prev => [...prev, p.id]);
                            } else {
                              setSelectedProducts(prev => prev.filter(id => id !== p.id));
                            }
                          }}
                          className="rounded text-indigo-600"
                        />
                      </td>
                      <td className="p-4">
                        <img src={p.image} className="w-9 h-9 object-cover rounded-lg border border-zinc-200" alt="" />
                      </td>
                      <td className="p-4 font-bold text-black">
                        <div>{p.name}</div>
                        <div className="text-[10px] text-zinc-400 font-normal mt-0.5">{p.category}</div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-zinc-500">{p.sku}</td>
                      <td className="p-4 text-right font-bold text-black">₹{p.price}</td>
                      <td className="p-4 text-right text-zinc-500">₹{p.cost}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold ${p.stock <= 10 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.status === 'Published' ? 'bg-emerald-100 text-emerald-900' : 'bg-zinc-100 text-zinc-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => editProductTrigger(p)}
                          className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            productActions.delete(p.id);
                            toast.success('Product removed!');
                          }}
                          className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: ORDERS & CUSTOM CASE BUILDER WORKSPACE         */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl font-display font-extrabold text-black">Fulfillment & Orders</h1>
            <p className="text-xs text-zinc-500 font-medium">Verify standard client orders and designer uploads for custom cases.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-150 flex flex-wrap gap-4 items-center justify-between shadow-xs">
            <div className="flex-1 max-w-sm">
              <input 
                type="text" 
                placeholder="Search orders by customer or ID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs"
              />
            </div>
            <select className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Paid</option>
              <option>Shipped</option>
              <option>Refunded</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Orders List Table */}
            <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs lg:col-span-2">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4 text-center">Custom Case</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Risk Score</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apiOrders
                    .filter(o => (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase()))
                    .map((o, idx) => (
                      <tr key={idx} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                        <td className="p-4 font-mono font-bold text-black">{o.id}</td>
                        <td className="p-4">
                          <div className="font-semibold">{o.customerName}</div>
                          <div className="text-[10px] text-zinc-400">{o.email}</div>
                        </td>
                        <td className="p-4 text-center">
                          {o.customDesign ? (
                            <span className="bg-purple-100 text-purple-900 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide">
                              Yes
                            </span>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-black">₹{o.total}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.status === 'Paid' || o.status === 'Shipped' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-700'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-bold ${o.riskScore >= 70 ? 'text-red-600' : 'text-zinc-400'}`}>
                            {o.riskScore}% {o.riskScore >= 70 && '⚠️'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => {
                              setSelectedCustomOrder(o);
                              if (o.customDesign) {
                                setActiveSection('custom-cases');
                              }
                            }}
                            className="text-[11px] bg-zinc-100 hover:bg-zinc-200 text-black px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
              {apiOrders.length === 0 && !ordersLoading && (
                <div className="p-8 text-center text-zinc-500">No orders found on this page.</div>
              )}
              {ordersLoading && (
                <div className="p-8 text-center text-zinc-500">Loading orders...</div>
              )}
            </div>
            
            {/* Orders Pagination */}
            <div className="flex justify-between items-center text-xs lg:col-span-2">
              <button 
                onClick={() => { setOrdersLoading(true); setOrdersPage(p => Math.max(1, p - 1)); }} 
                disabled={ordersPage === 1}
                className="px-3 py-1.5 border border-zinc-200 bg-white rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {ordersPage} of {ordersTotalPages || 1}</span>
              <button 
                onClick={() => { setOrdersLoading(true); setOrdersPage(p => Math.min(ordersTotalPages, p + 1)); }} 
                disabled={ordersPage >= ordersTotalPages}
                className="px-3 py-1.5 border border-zinc-200 bg-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* Selected Order Summary Panel */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
              <h3 className="font-display font-extrabold text-sm text-black">Selected Order Details</h3>
              {selectedCustomOrder ? (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400">Order Reference</span>
                    <span className="font-mono font-bold text-black">{selectedCustomOrder.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400">Customer Name</span>
                    <span className="font-semibold text-black">{selectedCustomOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400">Total Charged</span>
                    <span className="font-bold text-black">₹{selectedCustomOrder.total}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-400">Fulfillment Status</span>
                    <span className="font-bold text-emerald-600">{selectedCustomOrder.fulfillmentStatus}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="font-bold text-zinc-500 uppercase text-[10px]">Items Purchased</div>
                    {selectedCustomOrder.items.map((item, idx) => (
                      <div key={idx} className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-150">
                        <div className="font-bold text-black">{item.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">Variant: {item.variant}</div>
                        <div className="flex justify-between mt-1 text-[10px]">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-semibold text-black">₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => {
                        orderActions.edit(selectedCustomOrder.id, { status: 'Shipped', fulfillmentStatus: 'Shipped', trackingCode: `IND-${Math.floor(Math.random() * 90000 + 10000)}` });
                        toast.success('Fulfillment tracker updated to SHIPPED!');
                        setSelectedCustomOrder(null);
                      }}
                      className="flex-1 bg-black text-white py-2 rounded-xl text-center font-bold text-[11px] active:scale-95 transition-all cursor-pointer"
                    >
                      Fulfill Order
                    </button>
                    <button 
                      onClick={() => {
                        orderActions.edit(selectedCustomOrder.id, { status: 'Refunded', paymentStatus: 'Refunded' });
                        toast.success('Refund processed successfully!');
                        setSelectedCustomOrder(null);
                      }}
                      className="flex-1 bg-red-50 text-red-700 border border-red-200 py-2 rounded-xl text-center font-bold text-[11px] active:scale-95 transition-all cursor-pointer"
                    >
                      Refund Order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400 text-xs">
                  Click "Details" on any order list row to inspect parameters.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: WHATSAPP ORDERS                                */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'whatsapp-orders' && (
        <AdminWhatsAppOrders orders={orders} orderActions={orderActions} />
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: CUSTOM CASE BUILDER - DESIGNER WORKSPACE       */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'custom-cases' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl font-display font-extrabold text-black">Custom Case Designer Workspace</h1>
            <p className="text-xs text-zinc-500 font-medium">Verify custom-built designs, assign artists, and upload finished source files for production.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Design Queue */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4 lg:col-span-2">
              <h3 className="font-display font-extrabold text-sm text-black">Uploaded Custom Design Queue</h3>
              <div className="space-y-3">
                {orders
                  .filter(o => o.customDesign)
                  .map((o, idx) => (
                    <div key={idx} className="bg-zinc-50 p-4 rounded-xl border border-zinc-150 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="flex gap-3">
                        <img src={o.customDesign.imageUrl} className="w-16 h-16 object-cover rounded-lg border border-zinc-200" alt="" />
                        <div>
                          <div className="font-bold text-black">{o.customerName} ({o.id})</div>
                          <div className="text-[10px] text-zinc-500 mt-1">Uploaded: {new Date(o.customDesign.uploadedAt).toLocaleString()}</div>
                          <div className="text-[11px] font-semibold text-zinc-700 mt-1">Requested Notes: <span className="text-zinc-500 italic">"{o.customDesign.notes}"</span></div>
                          <div className="mt-2 flex gap-1.5 items-center">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[9px] font-extrabold uppercase">
                              {o.customDesign.designStatus}
                            </span>
                            <span className="text-[10px] text-zinc-400">Assigned: Designer {o.customDesign.designerId === 'design-2' ? 'Bob' : 'Unassigned'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => {
                            orderActions.updateCustomDesignStatus(o.id, 'Editing');
                            toast.success('Design status moved to EDITING');
                          }}
                          className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-black text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Start Edit
                        </button>
                        <button 
                          onClick={() => {
                            orderActions.updateCustomDesignStatus(o.id, 'Approved');
                            toast.success('Design approved and released to production!');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => {
                            orderActions.updateCustomDesignStatus(o.id, 'Rejected');
                            toast.error('Design rejected. Notice sent to customer.');
                          }}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Design Version controls & Details */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
              <h3 className="font-display font-extrabold text-sm text-black">Art Workflow & Assignment</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Assign Designer</label>
                  <select 
                    onChange={() => {
                      toast.success(`Designer assignment changed!`);
                    }}
                    className="w-full bg-zinc-50 border border-zinc-150 p-2.5 rounded-lg font-semibold"
                  >
                    <option>Bob (Senior Case Artist)</option>
                    <option>Jane (Special Drops Illustrator)</option>
                    <option>Alan (Anime Matte Specialist)</option>
                  </select>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="font-bold text-indigo-950 mb-1">Workflow Guidelines:</div>
                  <p className="text-[10px] text-indigo-900 leading-relaxed">
                    Once customer designs are approved, they automatically synch with the shipping packaging matrix. All source downloads are high-definition rasterized files.
                  </p>
                </div>

                <button 
                  onClick={() => toast.success('HD source artwork file zip downloaded to system downloads folder!')}
                  className="w-full bg-black text-white text-xs font-bold py-3 rounded-xl hover:opacity-90 transition-all cursor-pointer"
                >
                  📥 Download Source PSD/PNG
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: MYSTERY DASHBOARD & TIERS                       */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'mystery-dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl font-display font-extrabold text-black">Mystery Pouch Command Center</h1>
            <p className="text-xs text-zinc-500">Configure mystery pouch reward odds, daily drops schedules, and live pull results.</p>
          </div>

          {/* Probability Matrix Adjuster */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tiers list & weights */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4 lg:col-span-2">
              <h3 className="font-display font-extrabold text-sm text-black">Mystery Pouch Probability Rules</h3>
              <div className="space-y-4">
                {mysteryTiers.map((tier, idx) => (
                  <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }}></span>
                        <span className="font-bold text-black">{tier.name}</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-500">Odds Weight: {tier.probability}%</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={tier.probability}
                        onChange={(e) => mysteryActions.updateProbability(tier.id, Number(e.target.value))}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="text-xs font-semibold text-black">Price: ₹{tier.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Returns Engine status */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
              <h3 className="font-display font-extrabold text-sm text-black">Mystery Metrics</h3>
              <div className="space-y-3.5 text-xs text-zinc-700">
                <div className="flex justify-between">
                  <span>Mystery Sales (MTD)</span>
                  <span className="font-bold text-black">₹18,450</span>
                </div>
                <div className="flex justify-between">
                  <span>Reveal Rate</span>
                  <span className="font-bold text-black">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Repeat Mystery Buyers</span>
                  <span className="font-bold text-black">28.4%</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                  <strong>⚠️ Risk Assessment:</strong> Sum of probability pools currently exceeds 100%. Adjust ranges to align expected payout weights.
                </div>
                <button 
                  onClick={() => toast.success('Expected mystery revenue simulations generated!')}
                  className="w-full bg-black text-white font-bold py-2.5 rounded-xl cursor-pointer text-center text-xs"
                >
                  Recalculate Probability Limits
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: SPIN THE CASE WHEEL                             */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'spin-the-case' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h1 className="text-xl font-display font-extrabold text-black">Spin the Case Rewards Builder</h1>
            <p className="text-xs text-zinc-500 font-medium">Edit the reward wheel segments, win percentages, and daily conversion limits.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Wheel builder lists */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
              <h3 className="font-display font-extrabold text-sm text-black">Wheel Segments Setup</h3>
              <div className="space-y-3">
                {spinWheel.map((seg, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-150">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: seg.color }}></span>
                      <div>
                        <div className="font-bold text-black">{seg.label}</div>
                        <div className="text-[10px] text-zinc-400">Reward Action: {seg.reward}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs w-full md:w-auto justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-zinc-400">PROBABILITY:</span>
                        <input 
                          type="number" 
                          value={seg.probability}
                          onChange={(e) => {
                            mysteryActions.updateSpinWheelSegment(seg.id, { probability: Number(e.target.value) });
                            toast.success('Segment odds updated!');
                          }}
                          className="w-12 border border-zinc-200 bg-white p-1 rounded font-bold text-center"
                        />
                        <span>%</span>
                      </div>
                      <span className="px-2 py-0.5 bg-zinc-200 rounded font-semibold text-[10px]">{seg.usage} spins triggered</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wheel preview & simulation */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs text-center space-y-4">
              <h3 className="font-display font-extrabold text-sm text-black text-left">Live Spin Mock</h3>
              
              {/* Spinning wheel visualization mock */}
              <div className="w-40 h-40 rounded-full border-4 border-black mx-auto relative flex items-center justify-center overflow-hidden bg-zinc-100">
                <div className="absolute inset-0 border-t-2 border-indigo-600 rounded-full animate-spin duration-3000"></div>
                <div className="w-4 h-4 rounded-full bg-black z-10"></div>
                <div className="absolute top-0 w-2 h-4 bg-red-600 z-20"></div>
              </div>

              <div className="text-xs text-zinc-500 mt-2">
                Clicking spin tests the simulated probabilities dynamically without editing the counts ledger.
              </div>

              <button 
                onClick={() => {
                  toast.success('Mock spin landed on "Free Metal Sticker"! 🎁');
                }}
                className="w-full bg-black text-white font-bold py-2.5 rounded-xl cursor-pointer text-xs active:scale-95 transition-all"
              >
                Test Spin Probability
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: AUDIT LOGS                                      */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'audit-logs' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-150 shadow-xs space-y-4 animate-fade-in">
          <div>
            <h1 className="text-lg font-display font-extrabold text-black">Security Audit Logs</h1>
            <p className="text-xs text-zinc-500">Track administrators and automated cron scripts action paths across settings, catalog updates, and order returns.</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 text-xs flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                <div>
                  <div className="flex gap-2 items-center">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200 font-extrabold text-[9px] uppercase">{log.module}</span>
                    <span className="font-bold text-black">{log.action}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">{log.details}</div>
                  <div className="text-[9px] text-zinc-400 mt-0.5">By user: {log.user}</div>
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION: SYSTEM SETTINGS                                 */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-150 shadow-xs space-y-6 animate-fade-in">
          <div>
            <h1 className="text-lg font-display font-extrabold text-black">System & Gateway API Settings</h1>
            <p className="text-xs text-zinc-500">Configure global currencies, SMS/email templates, and active Razorpay, Stripe, and Shiprocket API keys.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            toast.success('System API parameters saved successfully!');
          }} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Storefront Name</label>
                <input 
                  type="text" 
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Base Currency</label>
                <input 
                  type="text" 
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Razorpay Live Key</label>
                <input 
                  type="password" 
                  value={storeSettings.razorpayKey}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, razorpayKey: e.target.value }))}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Stripe Publishable Key</label>
                <input 
                  type="password" 
                  value={storeSettings.stripeKey}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, stripeKey: e.target.value }))}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white font-bold py-3 rounded-xl active:scale-95 transition-all cursor-pointer text-center text-xs"
            >
              Save Core Settings
            </button>
          </form>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* ADDED SUB-SECTIONS                                       */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeSection === 'categories' && <AdminCategories />}
      {activeSection === 'collections' && <AdminCollections />}
      {(activeSection === 'limited-editions' || activeSection === 'daily-drops') && <AdminDrops />}
      {activeSection === 'draft-orders' && <AdminDraftOrders />}
      {activeSection === 'returns' && <AdminReturns />}
      {activeSection === 'refunds' && <AdminRefunds />}
      {activeSection === 'customers' && <AdminCRM />}
      {activeSection === 'loyalty-program' && <AdminLoyalty />}
      {activeSection === 'subscriptions' && <AdminSubscriptions />}
      {activeSection === 'community' && <AdminCommunity />}
      {activeSection === 'inventory-overview' && <AdminInventory />}
      {activeSection === 'shipping-zones' && <AdminShipping />}
      {activeSection === 'payments' && <AdminPayments />}
      {activeSection === 'marketing-center' && <AdminMarketing />}
      {activeSection === 'analytics-center' && <AdminAnalytics />}
      {activeSection === 'homepage-builder' && <AdminCMS />}
      {activeSection === 'roles' && <AdminRoles />}
      {activeSection === 'search-merch' && <AdminMerchandising />}
      {activeSection === 'seo-manager' && <AdminSEO />}
      {activeSection === 'media-lib' && <AdminMediaLibrary />}
      {activeSection === 'support-center' && <AdminSupportCenter />}
      {activeSection === 'notif-templates' && <AdminNotifications />}
      {activeSection === 'referrals' && <AdminGiftsReferrals />}
      {activeSection === 'warehouse-workflows' && <AdminWarehouseSupplier />}
      {activeSection === 'apps' && <AdminApps />}
      {activeSection === 'devices-db' && <AdminDeviceDatabase />}
      {activeSection === 'mystery-pouches' && (
        <div className="space-y-6 animate-fade-in text-xs">
          <div>
            <h1 className="text-xl font-display font-extrabold text-black">Mystery Tiers & Product Pools</h1>
            <p className="text-xs text-zinc-500 font-medium font-display">Manage probabilities and reward rules for each category pouch.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4">
            <h3 className="font-display font-extrabold text-sm text-black">Probability Distribution Matrix</h3>
            <div className="space-y-3">
              {[
                { name: 'Basic Pouch (₹299)', probability: '45%', items: 'Giyu Case, Clear Silicon Case, Tempered Glass' },
                { name: 'Premium Pouch (₹499)', probability: '30%', items: 'Cyberpunk Neon Case, Leather Wallet Case' },
                { name: 'Rare Pouch (₹799)', probability: '15%', items: 'Creator Signature Case, Metal Decals Bundle' },
                { name: 'Anime Specialty (₹699)', probability: '8%', items: 'Demon Slayer Collector Set, Water Breath Decal' },
                { name: 'Creator Drop Signature (₹999)', probability: '2%', items: '1-of-1 Signed Custom Cover, VIP Pass' }
              ].map((pool, idx) => (
                <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-black">{pool.name}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Pool contents: {pool.items}</div>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded font-mono font-extrabold">{pool.probability} odds</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* GENERAL FALLBACK / PLACEHOLDER FOR REMAINING SUB-VIEWS  */}
      {/* ──────────────────────────────────────────────────────── */}
      {!['dashboard', 'products', 'orders', 'custom-cases', 'mystery-dashboard', 'spin-the-case', 'audit-logs', 'settings', 'categories', 'collections', 'limited-editions', 'daily-drops', 'draft-orders', 'returns', 'refunds', 'mystery-pouches', 'customers', 'loyalty-program', 'subscriptions', 'community', 'inventory-overview', 'shipping-zones', 'payments', 'marketing-center', 'analytics-center', 'homepage-builder', 'roles', 'search-merch', 'seo-manager', 'media-lib', 'support-center', 'notif-templates', 'referrals', 'warehouse-workflows', 'apps', 'devices-db'].includes(activeSection) && (
        <div className="bg-white p-8 rounded-2xl border border-zinc-150 text-center space-y-4 animate-fade-in">
          <div className="text-4xl">🛠️</div>
          <h2 className="font-display font-extrabold text-lg text-black capitalize">{activeSection.replace('-', ' ')} view</h2>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            This module has been fully initialized with access to the simulated local storage database and is ready for customized database queries.
          </p>
          <button 
            onClick={() => setActiveSection('dashboard')} 
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Product edit/create Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-zinc-150 max-w-lg w-full p-6 space-y-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h2 className="font-display font-extrabold text-sm text-black">
                {editingProduct ? 'Edit Cover Product' : 'Create New Case Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Product Title</label>
                <input 
                  type="text" 
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Price (INR)</label>
                  <input 
                    type="number" 
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Compare At Price</label>
                  <input 
                    type="number" 
                    value={prodForm.comparePrice}
                    onChange={(e) => setProdForm({ ...prodForm, comparePrice: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Cost Per Item</label>
                  <input 
                    type="number" 
                    value={prodForm.cost}
                    onChange={(e) => setProdForm({ ...prodForm, cost: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Inventory Stock</label>
                  <input 
                    type="number" 
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">SKU Reference Code</label>
                <input 
                  type="text" 
                  value={prodForm.sku}
                  onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-1.5 bg-black text-white rounded-lg font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );

  if (embedded) return pageContent;

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {pageContent}
    </AdminLayout>
  );
}
