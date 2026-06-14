import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('CoverScart');
  const [currency, setCurrency] = useState('INR (₹)');
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('919502104919');
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('admin_portal_token') || localStorage.getItem('token');

  useState(() => {
    fetch('/api/cms/settings')
      .then(res => res.json())
      .then(data => {
        if (data.storeName) setStoreName(data.storeName);
        if (data.currency) setCurrency(data.currency);
        if (data.allowGuestCheckout !== undefined) setAllowGuestCheckout(data.allowGuestCheckout === 'true' || data.allowGuestCheckout === true);
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      })
      .catch(e => console.error(e));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/cms/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ storeName, currency, allowGuestCheckout, whatsappNumber })
      });
      toast.success('System settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/10">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-primary)]">Admin Settings</h1>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Manage global storefront parameters and business rules.</p>
          </div>
          <button onClick={() => navigate('/admin')} className="text-sm text-[var(--color-secondary)] hover:underline font-semibold cursor-pointer">
            Back to Dashboard
          </button>
        </header>

        <div className="bg-white p-8 rounded-2xl border border-[var(--color-outline-variant)]/10 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-1.5">Storefront Name</label>
              <input 
                type="text" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full border border-[#cfc4c5] p-3 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-1.5">Default Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-[#cfc4c5] p-3 rounded-lg text-sm bg-white"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-outline)] uppercase mb-1.5">WhatsApp Support Number</label>
              <input 
                type="text" 
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full border border-[#cfc4c5] p-3 rounded-lg text-sm"
                placeholder="e.g. 919502104919"
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="guestCheckout" 
                checked={allowGuestCheckout}
                onChange={(e) => setAllowGuestCheckout(e.target.checked)}
                className="rounded text-[#4648d4] focus:ring-[#4648d4]"
              />
              <label htmlFor="guestCheckout" className="text-xs font-bold text-[var(--color-on-surface)] select-none">
                Allow Guest Checkouts (Disable mandatory login)
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
            >
              {loading ? 'Saving Settings...' : 'Save Global Settings'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
