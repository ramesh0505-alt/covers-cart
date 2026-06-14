import { Link } from 'react-router-dom';

export default function AdminCMSPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-6xl mx-auto bg-[var(--color-surface-container-lowest)] p-8 rounded-2xl shadow-sm border border-[var(--color-outline-variant)]/15">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-display font-bold text-[var(--color-primary)]">Homepage CMS Manager</h1>
          <Link to="/admin" className="text-sm text-[var(--color-secondary)] hover:underline">Back to Dashboard</Link>
        </div>
        <p className="text-[var(--color-on-surface-variant)] text-sm">CMS configuration editor offline.</p>
      </div>
    </div>
  );
}
