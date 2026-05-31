import { useDashboardStore } from '@/store/dashboardStore';
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectionBadge() {
  const connected = useDashboardStore((s) => s.connected);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
        connected
          ? 'bg-marine-500/15 text-marine-400 border border-marine-500/25'
          : 'bg-pollution-500/15 text-pollution-400 border border-pollution-500/25 animate-pulse'
      }`}
    >
      {connected ? (
        <>
          <Wifi className="w-3 h-3" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          Disconnected
        </>
      )}
    </div>
  );
}
