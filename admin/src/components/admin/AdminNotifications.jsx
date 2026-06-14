import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const [templates, setTemplates] = useState([
    { id: 'notif-1', channel: 'Email', event: 'Order Paid Confirmation', subject: 'Your CoverScart Order {{order_id}} is confirmed!', status: 'Active' },
    { id: 'notif-2', channel: 'SMS', event: 'Shipping Tracker Out for Delivery', subject: 'CoverScart: Your case is out for delivery with Delhivery. Tracker: {{tracking_code}}', status: 'Active' },
    { id: 'notif-3', channel: 'Push', event: 'Mystery Pouch Unbox Incentive', subject: 'Reveal your premium cover tier unboxing points now! 🎁', status: 'Active' }
  ]);

  const [editing, setEditing] = useState(null);
  const [subjectText, setSubjectText] = useState('');

  const handleSave = (id) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, subject: subjectText } : t));
    toast.success('Notification trigger template edited successfully!');
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      <div>
        <h1 className="text-xl font-display font-extrabold text-black">Notification Template Engine</h1>
        <p className="text-xs text-zinc-500 font-medium font-display">Configure transactional system messages sent automatically over email, SMS, and WhatsApp APIs.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-150 overflow-hidden shadow-xs space-y-4 p-5">
        <h3 className="font-display font-extrabold text-sm text-black">Automated Transactional Templates</h3>
        
        <div className="space-y-3">
          {templates.map((tpl) => (
            <div key={tpl.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-700 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded">{tpl.channel}</span>
                  <span className="font-bold text-black">{tpl.event}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
              </div>
              
              {editing === tpl.id ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={subjectText}
                    onChange={(e) => setSubjectText(e.target.value)}
                    className="flex-1 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg font-mono text-[11px]"
                  />
                  <button onClick={() => handleSave(tpl.id)} className="bg-black text-white px-3.5 py-1.5 rounded-lg font-bold">Save</button>
                  <button onClick={() => setEditing(null)} className="bg-zinc-200 text-black px-3 py-1.5 rounded-lg font-bold">Cancel</button>
                </div>
              ) : (
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="font-mono text-[11px] leading-relaxed">"{tpl.subject}"</span>
                  <button 
                    onClick={() => { setEditing(tpl.id); setSubjectText(tpl.subject); }}
                    className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Edit Template
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
