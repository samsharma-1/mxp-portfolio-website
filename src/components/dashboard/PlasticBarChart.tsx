import { useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const PLASTIC_COLORS = {
  macro: '#ff5c5c',
  micro: '#ff8533',
};

export default function PlasticBarChart() {
  const history = useDashboardStore((s) => s.history);
  const liveData = useDashboardStore((s) => s.liveData);

  const chartData = useMemo(() => {
    const sampled = history.filter((_, i) => i % 10 === 0).slice(-30);
    return sampled.map((d, i) => ({
      idx: i,
      time: new Date(d.timestamp).toLocaleTimeString([], {
        minute: '2-digit',
        second: '2-digit',
      }),
      macro: d.species_counts?.macroplastic ?? 0,
      micro: Math.round(d.microplastic_density * 100),
    }));
  }, [history]);

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider mb-1">
        Plastic Pollution
      </h3>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PLASTIC_COLORS.macro }} />
          <span className="text-[10px] text-ocean-300">Macro</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: PLASTIC_COLORS.micro }} />
          <span className="text-[10px] text-ocean-300">Micro (×100)</span>
        </div>
      </div>

      <div className="h-44">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradient-macro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5c5c" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ff5c5c" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="gradient-micro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff8533" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#ff8533" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,230,219,0.06)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 13, 23, 0.9)',
                  border: '1px solid rgba(255, 92, 92, 0.3)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="macro" fill="url(#gradient-macro)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="micro" fill="url(#gradient-micro)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-ocean-500 text-sm">
            Collecting pollution data…
          </div>
        )}
      </div>
    </div>
  );
}
