import { useState, useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useQuery } from '@tanstack/react-query';
import { getActiveTracks } from '@/services/api';
import { SPECIES_COLOURS, SPECIES_ICONS } from '@/types';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';

type SortKey = 'track_id' | 'class_name' | 'confidence' | 'age';
type SortDir = 'asc' | 'desc';

export default function ActiveTracksTable() {
  const sessionActive = useDashboardStore((s) => s.sessionActive);
  const [sortKey, setSortKey] = useState<SortKey>('track_id');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filter, setFilter] = useState('');

  const { data } = useQuery({
    queryKey: ['active-tracks'],
    queryFn: getActiveTracks,
    refetchInterval: sessionActive ? 2000 : false,
    enabled: sessionActive,
  });

  const tracks = useMemo(() => {
    let items = data?.tracks ?? [];

    // Filter
    if (filter) {
      items = items.filter(
        (t) =>
          t.class_name.includes(filter.toLowerCase()) ||
          String(t.track_id).includes(filter),
      );
    }

    // Sort
    items = [...items].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return items;
  }, [data, sortKey, sortDir, filter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? (
        <ChevronUp className="w-3 h-3" />
      ) : (
        <ChevronDown className="w-3 h-3" />
      )
    ) : null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-biolum-400/10">
        <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider">
          Active Tracks ({tracks.length})
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-ocean-500" />
          <input
            type="text"
            placeholder="Filter…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-ocean-900/50 border border-ocean-700/40 rounded-lg px-2 py-1 text-xs text-ocean-200 placeholder-ocean-600 w-28 focus:outline-none focus:border-biolum-400/30"
          />
        </div>
      </div>

      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-ocean-950/90 backdrop-blur-sm">
            <tr className="text-ocean-400">
              {[
                { key: 'track_id' as SortKey, label: 'ID' },
                { key: 'class_name' as SortKey, label: 'Species' },
                { key: 'confidence' as SortKey, label: 'Conf' },
                { key: 'age' as SortKey, label: 'Age' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-3 py-2 text-left font-semibold cursor-pointer hover:text-ocean-200 transition-colors select-none"
                  onClick={() => toggleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-left font-semibold">BBox</th>
            </tr>
          </thead>
          <tbody>
            {tracks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-ocean-600">
                  No active tracks
                </td>
              </tr>
            ) : (
              tracks.slice(0, 50).map((t) => (
                <tr
                  key={t.track_id}
                  className="border-t border-ocean-800/30 hover:bg-ocean-800/20 transition-colors"
                >
                  <td className="px-3 py-2 font-mono text-biolum-400">
                    #{t.track_id}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span>{SPECIES_ICONS[t.class_name] ?? '❓'}</span>
                      <span
                        className="capitalize font-medium"
                        style={{ color: SPECIES_COLOURS[t.class_name] }}
                      >
                        {t.class_name.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono">
                    <span
                      className={
                        t.confidence > 0.7
                          ? 'text-marine-400'
                          : t.confidence > 0.5
                            ? 'text-yellow-400'
                            : 'text-ocean-400'
                      }
                    >
                      {(t.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-ocean-300 font-mono">
                    {t.age}f
                  </td>
                  <td className="px-3 py-2 text-ocean-500 font-mono text-[10px]">
                    [{t.bbox.x1},{t.bbox.y1}]-[{t.bbox.x2},{t.bbox.y2}]
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
