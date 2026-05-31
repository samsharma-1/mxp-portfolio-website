import { useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SPECIES_COLOURS } from '@/types';

const TRACKED_SPECIES = ['fish', 'coral', 'jellyfish', 'macroplastic'];

export default function SpeciesTimeline() {
  const history = useDashboardStore((s) => s.history);

  const chartData = useMemo(() => {
    // Sample every 5th data point to keep chart performant
    const sampled = history.filter((_, i) => i % 5 === 0).slice(-120);
    return sampled.map((d, i) => ({
      idx: i,
      time: new Date(d.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      ...d.species_counts,
    }));
  }, [history]);

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider mb-3">
        Species Timeline
      </h3>

      <div className="h-48">
        {chartData.length > 2 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                {TRACKED_SPECIES.map((species) => (
                  <linearGradient key={species} id={`grad-${species}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SPECIES_COLOURS[species]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={SPECIES_COLOURS[species]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,230,219,0.06)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 13, 23, 0.9)',
                  border: '1px solid rgba(0, 230, 219, 0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              {TRACKED_SPECIES.map((species) => (
                <Area
                  key={species}
                  type="monotone"
                  dataKey={species}
                  stroke={SPECIES_COLOURS[species]}
                  fill={`url(#grad-${species})`}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-ocean-500 text-sm">
            Waiting for data…
          </div>
        )}
      </div>
    </div>
  );
}
