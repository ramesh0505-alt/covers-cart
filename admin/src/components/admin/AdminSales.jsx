import { useState } from 'react';
import toast from 'react-hot-toast';

export function AdminDraftOrders() {
  const [drafts, setDrafts] = useState([
    { id: 'DFT-4021', customerName: 'Kunal Sen', items: '2x Cyberpunk Cases', total: 1998, status: 'Invoice Sent', date: '2026-06-12' },
    { id: 'DFT-4020', customerName: 'Mansi Joshi', items: '1x Custom Glass Case', total: 1299, status: 'Draft', date: '2026-06-11' }
  ]);

  const handleCreateDraft = () => {
    const newD = {
      id: `DFT-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerName: 'Anonymous Client',
      items: '1x Premium Phone Case',
      total: 999,
      status: 'Draft',
      date: new Date().toISOString().split('T')[0]
    };
    setDrafts(prev => [newD, ...prev]);
    toast.success('Draft order created!');
  };

  const handleSendInvoice = (id) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, status: 'Invoice Sent' } : d));
    toast.success('Simulated email invoice sent to customer successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-display font-extrabold text-black">Draft Orders & Pro-forma Invoices</h1>
          <p className="text-xs text-zinc-500 font-medium">Create orders manually for wholesale buyers or client support cases, and email payment links.</p>
        </div>
        <button onClick={handleCreateDraft} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer">
          + Create Draft Order
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Draft Reference</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4 text-right">Estimated Total</th>
              <th className="p-4 text-center">Created Date</th>
              <th className="p-4 text-center">Billing Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((d) => (
              <tr key={d.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-mono font-bold text-black">{d.id}</td>
                <td className="p-4 font-semibold text-black">{d.customerName}</td>
                <td className="p-4 text-zinc-500">{d.items}</td>
                <td className="p-4 text-right font-bold text-black">₹{d.total}</td>
                <td className="p-4 text-center text-zinc-500 font-mono font-semibold">{d.date}</td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${d.status === 'Invoice Sent' ? 'bg-indigo-100 text-indigo-950' : 'bg-zinc-150 text-zinc-650'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleSendInvoice(d.id)} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Send Invoice</button>
                  <button onClick={() => { setDrafts(prev => prev.filter(item => item.id !== d.id)); toast.success('Draft deleted!'); }} className="text-xs font-bold text-red-650 hover:underline cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminReturns() {
  const [rmas, setRmas] = useState([
    { id: 'RMA-903', orderId: 'ORD-8941', customerName: 'Sneha Rao', reason: 'Incorrect device size model shipped', status: 'Pending Review', date: '2026-06-12' },
    { id: 'RMA-902', orderId: 'ORD-8920', customerName: 'Karan Malhotra', reason: 'Print art peeling at corner edges', status: 'RMA Approved', date: '2026-06-10' }
  ]);

  const handleUpdateStatus = (id, nextStatus) => {
    setRmas(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));
    toast.success(`RMA status updated to ${nextStatus}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Returns Management & RMAs</h1>
        <p className="text-xs text-zinc-500 font-medium">Verify reverse-shipping requests, authorize refunds, and issue carrier labels.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">RMA Reference</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Reason for Return</th>
              <th className="p-4 text-center">Filing Date</th>
              <th className="p-4 text-center">Authorization Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rmas.map((r) => (
              <tr key={r.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-mono font-bold text-black">{r.id}</td>
                <td className="p-4 font-mono text-zinc-500">{r.orderId}</td>
                <td className="p-4 font-bold text-zinc-700">{r.customerName}</td>
                <td className="p-4 text-zinc-500">{r.reason}</td>
                <td className="p-4 text-center font-semibold text-zinc-400">{r.date}</td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.status === 'RMA Approved' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleUpdateStatus(r.id, 'RMA Approved')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">Approve</button>
                  <button onClick={() => handleUpdateStatus(r.id, 'Rejected')} className="text-xs font-bold text-red-650 hover:underline cursor-pointer">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminRefunds() {
  const [refunds] = useState([
    { id: 'REF-3021', orderId: 'ORD-8941', customerName: 'Sneha Rao', gateway: 'UPI', amount: 899, date: '2026-06-12', status: 'Completed' },
    { id: 'REF-3020', orderId: 'ORD-8912', customerName: 'Ravi Teja', gateway: 'Razorpay', amount: 1299, date: '2026-06-09', status: 'Processing' }
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Refund Transaction Ledger</h1>
        <p className="text-xs text-zinc-500 font-medium">Verify automated Stripe/Razorpay payouts and historical refund status.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Refund ID</th>
              <th className="p-4">Order Reference</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Payment Gateway</th>
              <th className="p-4 text-right">Refund Amount</th>
              <th className="p-4 text-center">Filing Date</th>
              <th className="p-4 text-center">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((ref) => (
              <tr key={ref.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-mono font-bold text-black">{ref.id}</td>
                <td className="p-4 font-mono text-zinc-500">{ref.orderId}</td>
                <td className="p-4 font-semibold text-zinc-700">{ref.customerName}</td>
                <td className="p-4 font-bold text-indigo-600">{ref.gateway}</td>
                <td className="p-4 text-right font-bold text-black">₹{ref.amount}</td>
                <td className="p-4 text-center text-zinc-400 font-semibold">{ref.date}</td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ref.status === 'Completed' ? 'bg-emerald-100 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
                    {ref.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
