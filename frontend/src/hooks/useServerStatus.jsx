/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import { checkBackendHealth } from '../lib/api';

/**
 * Polls the backend health endpoint every 30 seconds.
 * Returns { online: boolean, checking: boolean }
 */
export function useServerStatus() {
  const [online, setOnline]     = useState(true);   // optimistic default
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      if (!mounted) return;
      setChecking(true);
      const ok = await checkBackendHealth();
      if (mounted) {
        setOnline(ok);
        setChecking(false);
      }
    };

    check();
    const interval = setInterval(check, 30000); // re-check every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { online, checking };
}

/**
 * Shows a visible banner at the top when the backend is unreachable.
 */
export function ServerStatusBanner() {
  const { online, checking } = useServerStatus();

  if (checking || online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] bg-[var(--color-error)] text-[var(--color-on-error)] text-xs font-semibold text-center py-2 px-4 flex items-center justify-center gap-2 shadow-lg">
      <span className="material-symbols-outlined text-sm">wifi_off</span>
      Backend offline — some features may be unavailable.
      <button
        onClick={() => window.location.reload()}
        className="ml-2 underline hover:no-underline font-bold"
      >
        Retry
      </button>
    </div>
  );
}
