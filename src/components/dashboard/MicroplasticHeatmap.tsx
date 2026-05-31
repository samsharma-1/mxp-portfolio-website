import { useDashboardStore } from '@/store/dashboardStore';
import { useQuery } from '@tanstack/react-query';
import { getPlasticDensity } from '@/services/api';
import { Droplets } from 'lucide-react';

export default function MicroplasticHeatmap() {
  const liveData = useDashboardStore((s) => s.liveData);
  const sessionActive = useDashboardStore((s) => s.sessionActive);

  // Poll heatmap from REST API every 3 seconds
  const { data } = useQuery({
    queryKey: ['plastic-density'],
    queryFn: getPlasticDensity,
    refetchInterval: sessionActive ? 3000 : false,
    enabled: sessionActive,
  });

  const heatmapSrc = data?.heatmap_b64
    ? `data:image/jpeg;base64,${data.heatmap_b64}`
    : null;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider">
          Microplastic Heatmap
        </h3>
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-ocean-400" />
          <span className="text-xs text-ocean-300 font-mono">
            {liveData?.microplastic_density?.toFixed(3) ?? '0.000'}
            <span className="text-ocean-500"> p/m²</span>
          </span>
        </div>
      </div>

      <div className="aspect-video rounded-lg overflow-hidden bg-ocean-950 relative">
        {heatmapSrc ? (
          <img
            src={heatmapSrc}
            alt="Microplastic density heatmap"
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ocean-600 text-sm">
            <div className="text-center">
              <Droplets className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p>Heatmap unavailable</p>
            </div>
          </div>
        )}

        {/* Density bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-ocean-900/80">
          <div
            className="h-full transition-all duration-500 rounded-r"
            style={{
              width: `${Math.min((liveData?.microplastic_density ?? 0) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #00e670, #ffc832, #ff5c5c)',
            }}
          />
        </div>
      </div>

      {/* Particle type breakdown */}
      {data?.particle_types && Object.keys(data.particle_types).length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {Object.entries(data.particle_types).map(([type, count]) => (
            <div
              key={type}
              className="text-center px-2 py-1.5 rounded bg-ocean-900/50 border border-ocean-700/30"
            >
              <p className="text-xs text-ocean-400 capitalize">{type}</p>
              <p className="text-sm font-bold text-ocean-200">{count as number}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
