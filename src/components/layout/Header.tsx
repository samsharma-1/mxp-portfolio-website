import { useDashboardStore } from '@/store/dashboardStore';
import { Waves, Wifi, WifiOff, Activity, Clock, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { connected, liveData, alerts, sessionActive } = useDashboardStore();
  const location = useLocation();
  const [uptime, setUptime] = useState('00:00:00');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const pageTitle: Record<string, string> = {
    '/': 'Dashboard',
    '/tracks': 'Track Explorer',
    '/reports': 'Reports',
    '/settings': 'Settings',
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-biolum-400/10 bg-ocean-950/80 backdrop-blur-lg">
      {/* Left — Logo + title */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Waves className="w-8 h-8 text-biolum-400 group-hover:text-biolum-300 transition-colors" />
            <div className="absolute inset-0 w-8 h-8 rounded-full bg-biolum-400/20 blur-md group-hover:bg-biolum-400/30 transition-all" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-biolum-300 to-ocean-300 bg-clip-text text-transparent">
              Deep-Sea Vision
            </h1>
            <p className="text-[10px] text-ocean-400 -mt-1 font-medium tracking-widest uppercase">
              Ocean Health Monitor
            </p>
          </div>
        </Link>
        <span className="ml-4 text-sm font-medium text-ocean-300">
          {pageTitle[location.pathname] || 'Dashboard'}
        </span>
      </div>

      {/* Right — Status indicators */}
      <div className="flex items-center gap-5">
        {/* FPS */}
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-ocean-400" />
          <span className="text-sm font-mono text-ocean-200">
            {liveData?.fps?.toFixed(1) || '0.0'} <span className="text-ocean-500">FPS</span>
          </span>
        </div>

        {/* Session timer */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-ocean-400" />
          <span className="text-sm font-mono text-ocean-200">{uptime}</span>
        </div>

        {/* Alerts */}
        <div className="relative">
          <Bell className={`w-4 h-4 ${alerts.length > 0 ? 'text-pollution-400 animate-pulse' : 'text-ocean-400'}`} />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pollution-500 text-[10px] font-bold flex items-center justify-center">
              {alerts.length}
            </span>
          )}
        </div>

        {/* Connection status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          connected
            ? 'bg-marine-500/10 text-marine-400 border border-marine-500/20'
            : 'bg-pollution-500/10 text-pollution-400 border border-pollution-500/20'
        }`}>
          <div className="relative">
            {connected ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}
            <div className={`conn-pulse ${connected ? 'bg-marine-400' : 'bg-pollution-400'}`} />
          </div>
          {connected ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>
    </header>
  );
}
