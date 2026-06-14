import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminWarehouseSupplier() {
  const [pickQueue, setPickQueue] = useState([
    { id: 'PICK-09', orderId: 'ORD-8942', sku: 'CS-NEON-01', item: 'Cyberpunk Phone Case', location: 'Rack A-2, Bin 12', qty: 1, status: 'Ready to Pick' },
    { id: 'PICK-08', orderId: 'ORD-CUST-101', sku: 'CS-CUSTOM-01', item: 'Custom Printed TPU Case', location: 'Production Area (Designer Bob approved)', qty: 1, status: 'Printing' }
  ]);

  const [suppliers] = useState([
    { id: 'sup-1', name: 'Zhejiang Hardwares Corp', contact: 'Mr. Zhang', rawMaterial: 'TPU Shell Plates', rating: '4.8/5' },
    { id: 'sup-2', name: 'Mumbai Polymer Distributors', contact: 'Karan Patel', rawMaterial: 'Tempered Glass Backs', rating: '4.5/5' }
  ]);

  const handleBarcodeScan = () => {
    toast.success('Simulated barcode scanner triggered! SKU verified: CS-NEON-01. Item moved to packing bin.');
    setPickQueue(prev => prev.map(item => item.sku === 'CS-NEON-01' ? { ...item, status: 'Picked & Packed' } : item));
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Warehouse Logistics & Raw Material Vendors</h1>
        <p className="text-xs text-zinc-500 font-medium">Coordinate pick lists, pack queues, simulate barcode checkouts, and review restock agreements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Packing queue list */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-sm text-black">Pick & Pack Warehouse Queue</h3>
            <button 
              onClick={handleBarcodeScan}
              className="bg-black text-white px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1.5"
            >
              <span>📷</span> Scan Item Barcode
            </button>
          </div>
          <div className="space-y-2.5">
            {pickQueue.map((item) => (
              <div key={item.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 flex justify-between items-center">
                <div>
                  <div className="font-bold text-black">{item.item} (SKU: {item.sku})</div>
                  <div className="text-[10px] text-zinc-400 font-medium">Order: {item.orderId} | Storage Location: <span className="text-indigo-600 font-mono font-bold">{item.location}</span></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-650">Qty: {item.qty}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Picked & Packed' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Directories */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs h-fit space-y-4">
          <h3 className="font-display font-extrabold text-sm text-black">Registered Raw Material Suppliers</h3>
          <div className="space-y-3">
            {suppliers.map((sup) => (
              <div key={sup.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-150 space-y-1">
                <div className="font-bold text-black">{sup.name}</div>
                <div className="text-[10px] text-zinc-400 font-semibold">Contact: {sup.contact}</div>
                <div className="text-[10px] text-zinc-500 font-medium">Supplies: <span className="font-bold">{sup.rawMaterial}</span></div>
                <div className="text-[9px] text-indigo-650 font-bold mt-1">Vendor Score: {sup.rating}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
