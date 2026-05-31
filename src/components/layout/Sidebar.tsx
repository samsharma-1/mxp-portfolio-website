import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  FileText,
  Settings,
  Play,
  Square,
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { startStream, stopStream } from '@/services/api';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tracks', icon: Route, label: 'Tracks' },
  { to: '/reports', icon: FileText, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { sessionActive, setSessionActive } = useDashboardStore();

  const handleToggleSession = async () => {
    try {
      if (sessionActive) {
        await stopStream();
        setSessionActive(false);
      } else {
        const res = await startStream({ source: '0', resolution: [1280, 720] });
        setSessionActive(true, res.session_id);
      }
    } catch (err) {
      console.error('Stream toggle error:', err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 pt-16 border-r border-biolum-400/10 bg-ocean-950/90 backdrop-blur-lg z-40 flex flex-col">
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Session control */}
      <div className="px-3 pb-6">
        <button
          onClick={handleToggleSession}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            sessionActive
              ? 'bg-pollution-500/20 text-pollution-400 border border-pollution-500/30 hover:bg-pollution-500/30'
              : 'bg-marine-500/20 text-marine-400 border border-marine-500/30 hover:bg-marine-500/30 hover:shadow-glow-green'
          }`}
        >
          {sessionActive ? (
            <>
              <Square className="w-4 h-4" />
              Stop Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Session
            </>
          )}
        </button>

        {/* Simulation badge */}
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-biolum-400/10 text-biolum-400/70 border border-biolum-400/15">
            ⚡ Simulation Mode
          </span>
        </div>
      </div>
    </aside>
  );
}
