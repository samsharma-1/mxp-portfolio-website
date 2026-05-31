import { useDashboardStore } from '@/store/dashboardStore';
import { SPECIES_ICONS, SPECIES_COLOURS } from '@/types';

const SPECIES_ORDER = ['fish', 'coral', 'jellyfish', 'sea_turtle', 'crab', 'macroplastic', 'unknown_organism'];

export default function SpeciesCountCards() {
  const liveData = useDashboardStore((s) => s.liveData);
  const counts = liveData?.species_counts ?? {};

  return (
    <div className="glass-card p-4">
      <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider mb-3">
        Species Detected
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {SPECIES_ORDER.map((species) => {
          const count = counts[species] ?? 0;
          const icon = SPECIES_ICONS[species] ?? '❓';
          const color = SPECIES_COLOURS[species] ?? '#999';
          const isPlastic = species === 'macroplastic';

          return (
            <div
              key={species}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-300 ${
                count > 0
                  ? isPlastic
                    ? 'border-pollution-500/25 bg-pollution-500/5'
                    : 'border-biolum-400/15 bg-biolum-400/5'
                  : 'border-ocean-700/30 bg-ocean-900/30'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-ocean-400 capitalize truncate">
                  {species.replace('_', ' ')}
                </p>
                <p
                  className="text-lg font-bold leading-tight"
                  style={{ color: count > 0 ? color : 'rgba(255,255,255,0.2)' }}
                >
                  {count}
                </p>
              </div>
            </div>
          );
        })}

        {/* Total unique tracks */}
        <div className="col-span-2 flex items-center justify-between px-3 py-2 rounded-lg border border-biolum-400/15 bg-biolum-400/5">
          <span className="text-xs font-medium text-ocean-300">
            Total Unique Tracks
          </span>
          <span className="text-lg font-bold text-biolum-400">
            {liveData?.total_unique_tracks ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}
