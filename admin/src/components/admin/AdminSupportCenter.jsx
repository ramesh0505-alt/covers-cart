import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSupportCenter() {
  const [tickets, setTickets] = useState([
    { id: 'TKT-2021', name: 'Rohan Sharma', topic: 'Custom Art Upload Size Error', category: 'Case Builder', priority: 'High', status: 'Open' },
    { id: 'TKT-2020', name: 'Aditya Verma', topic: 'Loyalty Gold Tier points correction request', category: 'Rewards', priority: 'Medium', status: 'In Progress' }
  ]);

  const [activeTab, setActiveTab] = useState('Tickets');

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Customer Support & Resolutions Center</h1>
        <p className="text-xs text-zinc-500 font-medium">Coordinate live chat dialogues, reply to user support tickets, and resolve order status escalations.</p>
      </div>

      <div className="flex gap-2 border-b border-zinc-150 pb-2">
        {['Tickets', 'Live Chats', 'Escalations', 'Knowledge Base'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-bold rounded-xl transition-all cursor-pointer ${activeTab === tab ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs">
        {activeTab === 'Tickets' && (
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Subject Topic</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Priority</th>
                <th className="p-4 text-center">State</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <td className="p-4 font-mono font-bold text-black">{t.id}</td>
                  <td className="p-4 font-bold text-zinc-700">{t.name}</td>
                  <td className="p-4 text-zinc-500">{t.topic}</td>
                  <td className="p-4 font-semibold text-indigo-600">{t.category}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${t.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.status === 'Open' ? 'bg-blue-100 text-blue-950' : 'bg-zinc-150 text-zinc-650'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => toast.success(`Chat resolved for ${t.id}!`)} className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer">Reply</button>
                    <button onClick={() => { setTickets(prev => prev.filter(item => item.id !== t.id)); toast.success('Ticket closed!'); }} className="text-xs font-bold text-red-650 hover:underline cursor-pointer">Close</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab !== 'Tickets' && (
          <div className="p-8 text-center text-zinc-500 space-y-2">
            <div>💬</div>
            <div className="font-bold text-black font-display">Live dialogue server active</div>
            <p className="max-w-md mx-auto text-[11px] leading-relaxed">
              No active customer escalations or chats are waiting in the queue. Simulated server status holds clean state.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
