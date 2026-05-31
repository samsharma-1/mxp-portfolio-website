import { useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { POLLUTION_COLOURS } from '@/types';

export default function HealthGauge() {
  const liveData = useDashboardStore((s) => s.liveData);
  const score = liveData?.health_score ?? 0;
  const trend = liveData?.health_trend ?? 'stable';

  const { strokeColor, textColor, label, glowClass } = useMemo(() => {
    if (score >= 75) return { strokeColor: '#00e670', textColor: 'text-marine-400', label: 'Healthy', glowClass: 'stat-glow-green' };
    if (score >= 50) return { strokeColor: '#ffc832', textColor: 'text-yellow-400', label: 'Moderate', glowClass: 'stat-glow-yellow' };
    if (score >= 25) return { strokeColor: '#ff8533', textColor: 'text-orange-400', label: 'At Risk', glowClass: 'stat-glow-yellow' };
    return { strokeColor: '#ff3333', textColor: 'text-pollution-400', label: 'Critical', glowClass: 'stat-glow-red' };
  }, [score]);

  // SVG arc parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const trendSymbol = trend === 'improving' ? '▲' : trend === 'declining' ? '▼' : '●';
  const trendColor = trend === 'improving' ? 'text-marine-400' : trend === 'declining' ? 'text-pollution-400' : 'text-ocean-400';

  return (
    <div className={`glass-card p-5 flex flex-col items-center ${glowClass}`}>
      <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider mb-3">
        Ocean Health Index
      </h3>

      {/* Gauge SVG */}
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background ring */}
          <circle
            cx="80" cy="80" r={radius}
            stroke="rgba(0, 230, 219, 0.08)"
            strokeWidth="10"
            fill="none"
          />
          {/* Active ring */}
          <circle
            cx="80" cy="80" r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="gauge-ring"
            style={{
              filter: `drop-shadow(0 0 8px ${strokeColor}60)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${textColor}`}>
            {score.toFixed(0)}
          </span>
          <span className="text-xs text-ocean-400">/100</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-3 mt-3">
        <span className={`text-sm font-semibold ${textColor}`}>{label}</span>
        <span className={`text-xs ${trendColor}`}>
          {trendSymbol} {trend}
        </span>
      </div>

      {/* Pollution level */}
      {liveData && (
        <div className="mt-2 flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: POLLUTION_COLOURS[liveData.pollution_level] || '#999' }}
          />
          <span className="text-xs text-ocean-300">
            Pollution: {liveData.pollution_level}
          </span>
        </div>
      )}
    </div>
  );
}
