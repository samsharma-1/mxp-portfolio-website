import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHealth } from '@/services/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  Sliders,
  Cpu,
  HardDrive,
  Wifi,
  Camera,
  Box,
  RefreshCw,
  Save,
  CheckCircle,
  XCircle,
} from 'lucide-react';

// Default thresholds from context.md
const DEFAULT_THRESHOLDS: Record<string, number> = {
  fish: 0.45,
  coral: 0.50,
  macroplastic: 0.40,
  jellyfish: 0.50,
  sea_turtle: 0.55,
  crab: 0.50,
  unknown_organism: 0.35,
};

export default function Settings() {
  const { sendMessage } = useWebSocket();
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [saved, setSaved] = useState(false);

  const { data: health, isLoading } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchInterval: 5000,
  });

  const handleThresholdChange = (cls: string, value: number) => {
    setThresholds((prev) => ({ ...prev, [cls]: value }));
  };

  const saveThreshold = (cls: string) => {
    sendMessage({
      action: 'set_threshold',
      class: cls,
      confidence: thresholds[cls],
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetAll = () => {
    setThresholds(DEFAULT_THRESHOLDS);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-ocean-400">
          Configure detection thresholds, camera settings, and view system info
        </p>
      </div>

      {/* System Status */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-biolum-400" />
          System Status
        </h3>

        {isLoading ? (
          <div className="flex items-center gap-2 text-ocean-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading system status…
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass-panel text-center">
                <p className="text-[10px] text-ocean-500 mb-1">Status</p>
                <p
                  className={`text-sm font-bold ${
                    health?.status === 'ok'
                      ? 'text-marine-400'
                      : 'text-yellow-400'
                  }`}
                >
                  {health?.status?.toUpperCase() ?? 'UNKNOWN'}
                </p>
              </div>
              <div className="glass-panel text-center">
                <p className="text-[10px] text-ocean-500 mb-1">Uptime</p>
                <p className="text-sm font-bold text-biolum-400">
                  {health?.uptime_seconds
                    ? `${Math.floor(health.uptime_seconds / 60)}m`
                    : '—'}
                </p>
              </div>
              <div className="glass-panel text-center">
                <p className="text-[10px] text-ocean-500 mb-1">Mode</p>
                <p className="text-sm font-bold text-biolum-400">
                  {health?.simulation_mode ? 'Simulation' : 'Production'}
                </p>
              </div>
              <div className="glass-panel text-center">
                <p className="text-[10px] text-ocean-500 mb-1">Camera</p>
                <p
                  className={`text-sm font-bold ${
                    health?.camera_connected
                      ? 'text-marine-400'
                      : 'text-ocean-500'
                  }`}
                >
                  {health?.camera_connected ? 'Connected' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Model status */}
            <div>
              <p className="text-xs text-ocean-400 font-semibold mb-2 uppercase tracking-wider">
                Model Status
              </p>
              <div className="space-y-2">
                {health?.models?.map((model) => (
                  <div
                    key={model.name}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-ocean-900/40 border border-ocean-800/30"
                  >
                    <div className="flex items-center gap-3">
                      {model.loaded ? (
                        <CheckCircle className="w-4 h-4 text-marine-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-pollution-400" />
                      )}
                      <span className="text-sm text-ocean-200">
                        {model.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-ocean-400 px-2 py-0.5 rounded bg-ocean-800/40">
                      {model.engine_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detection Thresholds */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-biolum-400" />
            Detection Thresholds
          </h3>
          <button
            onClick={resetAll}
            className="text-xs text-ocean-400 hover:text-ocean-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset defaults
          </button>
        </div>

        {saved && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-marine-500/10 border border-marine-500/20 text-marine-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5" />
            Threshold saved and applied in real-time
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(thresholds).map(([cls, value]) => (
            <div key={cls} className="flex items-center gap-4">
              <span className="w-36 text-sm text-ocean-200 capitalize">
                {cls.replace('_', ' ')}
              </span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={value}
                  onChange={(e) =>
                    handleThresholdChange(cls, parseFloat(e.target.value))
                  }
                  className="w-full h-1.5 rounded-full appearance-none bg-ocean-800 accent-biolum-400 cursor-pointer"
                />
              </div>
              <span className="w-14 text-right text-sm font-mono text-biolum-400">
                {(value * 100).toFixed(0)}%
              </span>
              <button
                onClick={() => saveThreshold(cls)}
                className="p-1.5 rounded-lg bg-ocean-800/40 hover:bg-ocean-700/40 text-ocean-400 hover:text-biolum-400 transition-colors"
                title="Apply threshold"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Configuration */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Camera className="w-4 h-4 text-biolum-400" />
          Camera Configuration
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-ocean-400 mb-1">Source</label>
            <input
              type="text"
              defaultValue="0"
              className="w-full bg-ocean-900/50 border border-ocean-700/40 rounded-lg px-3 py-2 text-sm text-ocean-200 focus:outline-none focus:border-biolum-400/30"
            />
          </div>
          <div>
            <label className="block text-xs text-ocean-400 mb-1">
              Resolution
            </label>
            <input
              type="text"
              defaultValue="1280×720"
              disabled
              className="w-full bg-ocean-900/50 border border-ocean-700/40 rounded-lg px-3 py-2 text-sm text-ocean-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-ocean-400 mb-1">
              Target FPS
            </label>
            <input
              type="number"
              defaultValue={15}
              className="w-full bg-ocean-900/50 border border-ocean-700/40 rounded-lg px-3 py-2 text-sm text-ocean-200 focus:outline-none focus:border-biolum-400/30"
            />
          </div>
          <div>
            <label className="block text-xs text-ocean-400 mb-1">
              Max Lost Frames
            </label>
            <input
              type="number"
              defaultValue={30}
              className="w-full bg-ocean-900/50 border border-ocean-700/40 rounded-lg px-3 py-2 text-sm text-ocean-200 focus:outline-none focus:border-biolum-400/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
