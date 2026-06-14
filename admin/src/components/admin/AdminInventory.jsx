import { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import toast from 'react-hot-toast';

export default function AdminInventory() {
  const { warehouses } = useAdminData();
  const [poList, setPoList] = useState([
    { id: 'PO-301', supplier: 'Zhejiang Hardwares Corp', items: '500x TPU Case Shells', status: 'Pending Delivery', deliveryDate: '2026-06-25' },
    { id: 'PO-300', supplier: 'Mumbai Polymer Distributors', items: '200x Glass Backplates', status: 'Delivered', deliveryDate: '2026-06-08' }
  ]);

  const [ledger] = useState([
    { date: '2026-06-12 17:15', sku: 'CS-NEON-01', change: '-1 (Order ORD-8942)', source: 'Sales Order Checkout', user: 'System checkout' },
    { date: '2026-06-12 11:20', sku: 'CS-LTHR-02', change: '+20 (PO-300)', source: 'Purchase Order Ingestion', user: 'Warehouse Manager' }
  ]);

  const [searchSku, setSearchSku] = useState('');
  const [showPoModal, setShowPoModal] = useState(false);
  const [poForm, setPoForm] = useState({ supplier: '', items: '', status: 'Pending Delivery', deliveryDate: '' });

  const handleCreatePo = (e) => {
    e.preventDefault();
    const newPo = {
      id: `PO-${Math.floor(Math.random() * 900 + 100)}`,
      ...poForm
    };
    setPoList(prev => [newPo, ...prev]);
    toast.success('Purchase order created successfully!');
    setShowPoModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Inventory Overview & Multi-Warehouse management</h1>
        <p className="text-xs text-zinc-500 font-medium">Verify multi-warehouse stocks, ledger change logs, and track raw materials purchase orders.</p>
      </div>

      {/* Warehouse Listing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {warehouses.map((wh) => (
          <div key={wh.id} className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-black text-sm">{wh.name}</span>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-extrabold text-[9px] uppercase">Active Hub</span>
            </div>
            <p className="text-zinc-400 font-semibold">{wh.location}</p>
            <div className="flex justify-between border-t border-zinc-100 pt-2 text-[11px] font-semibold text-zinc-650">
              <span>Allocated Stock: <strong className="text-black">{wh.totalStock}</strong></span>
              <span className="text-amber-700 font-bold">{wh.lowItems} low items</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Ledger / Purchase Orders split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger logs */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-sm text-black">Stock Ledger Logs</h3>
            <input 
              type="text" 
              placeholder="Filter by SKU..." 
              value={searchSku}
              onChange={(e) => setSearchSku(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-lg text-xs"
            />
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {ledger
              .filter(l => l.sku.toLowerCase().includes(searchSku.toLowerCase()))
              .map((item, idx) => (
                <div key={idx} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex justify-between gap-3 items-center">
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="font-mono font-bold text-indigo-700">{item.sku}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.change.startsWith('+') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{item.change}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium mt-1">Source: {item.source}</div>
                    <div className="text-[9px] text-zinc-400">Authorized: {item.user}</div>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-550">{item.date}</div>
                </div>
            ))}
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-sm text-black">Purchase Orders</h3>
            <button onClick={() => setShowPoModal(true)} className="bg-black text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px]">
              + New PO
            </button>
          </div>
          <div className="space-y-3">
            {poList.map((po) => (
              <div key={po.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 space-y-2">
                <div className="flex justify-between font-bold text-black">
                  <span>{po.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${po.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-700'}`}>{po.status}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-semibold">{po.supplier}</div>
                <div className="text-[10px] text-zinc-400 font-semibold italic">"{po.items}"</div>
                <div className="text-[9px] text-zinc-400 border-t border-zinc-200/60 pt-1">ETA: {po.deliveryDate}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {showPoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-zinc-150 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h2 className="font-display font-extrabold text-sm text-black">Create Purchase Order</h2>
              <button onClick={() => setShowPoModal(false)} className="text-zinc-400 hover:text-black cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreatePo} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Supplier</label>
                <input 
                  type="text" 
                  value={poForm.supplier}
                  onChange={(e) => setPoForm({ ...poForm, supplier: e.target.value })}
                  className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Items / Materials Description</label>
                <textarea 
                  value={poForm.items}
                  onChange={(e) => setPoForm({ ...poForm, items: e.target.value })}
                  placeholder="e.g. 500x TPU Case Shells"
                  className="w-full border border-zinc-200 p-2.5 rounded-lg h-20"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Status</label>
                  <select 
                    value={poForm.status}
                    onChange={(e) => setPoForm({ ...poForm, status: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                  >
                    <option value="Pending Delivery">Pending Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Delivery Date</label>
                  <input 
                    type="date" 
                    value={poForm.deliveryDate}
                    onChange={(e) => setPoForm({ ...poForm, deliveryDate: e.target.value })}
                    className="w-full border border-zinc-200 p-2.5 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-zinc-100">
                <button type="button" onClick={() => setShowPoModal(false)} className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-black text-white rounded-lg font-bold">Create PO</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
