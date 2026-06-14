import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('All fields are required.');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Ticket submitted successfully! We will get back to you shortly.');
    setSubmitting(false);
    navigate('/account');
  };

  return (
    <div className="bg-[#faf8ff] text-[#131b2e] min-h-screen pb-24">
      <header className="sticky top-0 z-50 bg-[#faf8ff] border-b border-[#bdc9c5] px-5 h-16 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#f2f3ff] rounded-lg cursor-pointer">
          <span className="material-symbols-outlined text-[#131b2e]">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-[#131b2e]">Contact Support</h1>
        <div className="w-10" />
      </header>

      <main className="pt-6 px-5 max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-[#bdc9c5]/30 shadow-sm">
          <h2 className="text-lg font-bold font-display text-center mb-1">How can we help?</h2>
          <p className="text-xs text-[#6e7a76] text-center mb-6">Got questions about orders, products, or custom designs? Send us a ticket.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e7a76] mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-[#bdc9c5] focus:border-[#00695c] focus:ring-[#00695c] rounded-lg py-3 px-4 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e7a76] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full border border-[#bdc9c5] focus:border-[#00695c] focus:ring-[#00695c] rounded-lg py-3 px-4 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e7a76] mb-1.5">Message / Issue Details</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your query here..."
                className="w-full border border-[#bdc9c5] focus:border-[#00695c] focus:ring-[#00695c] rounded-lg py-3 px-4 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00695c] text-white py-4 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
            >
              {submitting ? 'Submitting query…' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
