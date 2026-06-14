import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminApps() {
  const [apps, setApps] = useState([
    { name: 'Klaviyo Email Automation', desc: 'Sync CRM customers and segments to deploy automated newsletters and recoveries.', status: 'Connected' },
    { name: 'WhatsApp Business API', desc: 'Send automated shipping and order confirmations directly to customer phone numbers.', status: 'Connected' },
    { name: 'Mailchimp Newsletter Sync', desc: 'Synchronize newsletter lists with customer records.', status: 'Not Connected' },
    { name: 'Google Analytics 4 Enhanced', desc: 'Track storefront funnel actions (Views, Add-To-Carts, Checkouts).', status: 'Connected' }
  ]);

  const handleToggle = (name) => {
    setApps(prev => prev.map(a => {
      if (a.name === name) {
        const nextStatus = a.status === 'Connected' ? 'Not Connected' : 'Connected';
        toast.success(`${a.name} is now ${nextStatus === 'Connected' ? 'installed' : 'disabled'}!`);
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Integrations & Apps Marketplace</h1>
        <p className="text-xs text-zinc-500 font-medium">Browse and install third-party plugins for CRM analytics, automated SMS flows, and catalog syndication.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map((app, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-zinc-150 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-black text-sm">{app.name}</h3>
              <p className="text-zinc-550 leading-relaxed font-semibold">{app.desc}</p>
            </div>
            
            <div className="flex justify-between items-center border-t border-zinc-100 pt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${app.status === 'Connected' ? 'bg-indigo-50 text-indigo-700' : 'bg-zinc-150 text-zinc-650'}`}>{app.status}</span>
              <button 
                onClick={() => handleToggle(app.name)}
                className={`text-[11px] px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer ${app.status === 'Connected' ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100' : 'bg-black text-white hover:opacity-90'}`}
              >
                {app.status === 'Connected' ? 'Disconnect App' : 'Connect App'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
