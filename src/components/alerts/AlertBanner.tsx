import { useDashboardStore } from '@/store/dashboardStore';
import { X, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function AlertBanner() {
  const { alerts, dismissAlert, clearAlerts } = useDashboardStore();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2 max-w-md animate-slide-up">
      {alerts.slice(-5).map((alert, idx) => {
        const isCritical = alert.includes('🔴') || alert.includes('⚠️');
        return (
          <div
            key={`${alert}-${idx}`}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg transition-all animate-fade-in ${
              isCritical
                ? 'bg-pollution-500/15 border-pollution-500/30 text-pollution-300'
                : 'bg-yellow-500/10 border-yellow-500/25 text-yellow-300'
            }`}
          >
            {isCritical ? (
              <AlertOctagon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm flex-1">{alert}</p>
            <button
              onClick={() => dismissAlert(idx)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}

      {alerts.length > 3 && (
        <button
          onClick={clearAlerts}
          className="w-full text-center text-xs text-ocean-400 hover:text-ocean-200 py-1"
        >
          Clear all alerts ({alerts.length})
        </button>
      )}
    </div>
  );
}
