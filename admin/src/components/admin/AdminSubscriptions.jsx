import { useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import toast from 'react-hot-toast';

export default function AdminSubscriptions() {
  const { subscriptions } = useAdminData();
  const [list, setList] = useState(subscriptions);

  const handleToggleStatus = (id) => {
    setList(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Active' ? 'Cancelled' : 'Active';
        toast.success(`Subscription status updated to ${nextStatus}!`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Subscription Engine</h1>
        <p className="text-xs text-zinc-500 font-medium">Monitor monthly case subscriptions, billing cycles, auto-renewals, and cancel or reactivate agreements.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <th className="p-4">Subscription ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Membership Plan</th>
              <th className="p-4 text-right">Recurring Fee</th>
              <th className="p-4 text-center">Billing Cycle</th>
              <th className="p-4 text-center">Next Billing Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((sub) => (
              <tr key={sub.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                <td className="p-4 font-mono font-bold text-black">{sub.id}</td>
                <td className="p-4">
                  <div className="font-bold text-black">{sub.customerName}</div>
                  <div className="text-[10px] text-zinc-400 font-medium">{sub.email}</div>
                </td>
                <td className="p-4 font-semibold text-zinc-700">{sub.plan}</td>
                <td className="p-4 text-right font-bold text-black">₹{sub.amount}</td>
                <td className="p-4 text-center text-zinc-500">{sub.billingCycle}</td>
                <td className="p-4 text-center text-zinc-500 font-mono font-semibold">{sub.nextBilling}</td>
                <td className="p-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sub.status === 'Active' ? 'bg-emerald-100 text-emerald-950' : 'bg-red-100 text-red-950'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleToggleStatus(sub.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${sub.status === 'Active' ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'}`}
                  >
                    {sub.status === 'Active' ? 'Cancel Auto-Renew' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
