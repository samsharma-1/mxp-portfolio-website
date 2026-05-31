import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getActiveTracks } from '@/services/api';
import { useDashboardStore } from '@/store/dashboardStore';
import { SPECIES_COLOURS, SPECIES_ICONS } from '@/types';
import {
  ChevronUp,
  ChevronDown,
  Search,
  MapPin,
  Eye,
} from 'lucide-react';
import type { TrackItem } from '@/types';

type SortKey = 'track_id' | 'class_name' | 'confidence' | 'age';

export default function Tracks() {
  const sessionActive = useDashboardStore((s) => s.sessionActive);
  const [sortKey, setSortKey] = useState<SortKey>('track_id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<TrackItem | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');

  const { data } = useQuery({
    queryKey: ['tracks-page'],
    queryFn: getActiveTracks,
    refetchInterval: sessionActive ? 2000 : false,
  });

  const allTracks = data?.tracks ?? [];

  const filteredTracks = useMemo(() => {
    let items = [...allTracks];

    if (speciesFilter !== 'all') {
      items = items.filter((t) => t.class_name === speciesFilter);
    }

    if (filter) {
      const q = filter.toLowerCase();
      items = items.filter(
        (t) =>
          t.class_name.includes(q) ||
          String(t.track_id).includes(q),
      );
    }

    items.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      const cmp =
        typeof va === 'string'
          ? va.localeCompare(vb as string)
          : (va as number) - (vb as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return items;
  }, [allTracks, sortKey, sortDir, filter, speciesFilter]);

  const speciesList = useMemo(() => {
    const set = new Set(allTracks.map((t) => t.class_name));
    return Array.from(set).sort();
  }, [allTracks]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Track Explorer</h2>
          <p className="text-sm text-ocean-400">
            {allTracks.length} active tracks across {speciesList.length} species
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-ocean-500" />
          <input
            type="text"
            placeholder="Search by ID or species…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-ocean-900/50 border border-ocean-700/40 rounded-lg px-3 py-2 text-sm text-ocean-200 placeholder-ocean-600 flex-1 focus:outline-none focus:border-biolum-400/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSpeciesFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              speciesFilter === 'all'
                ? 'bg-biolum-400/20 text-biolum-400 border border-biolum-400/30'
                : 'bg-ocean-800/40 text-ocean-400 border border-ocean-700/30 hover:text-ocean-200'
            }`}
          >
            All
          </button>
          {speciesList.map((s) => (
            <button
              key={s}
              onClick={() => setSpeciesFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                speciesFilter === s
                  ? 'bg-biolum-400/20 text-biolum-400 border border-biolum-400/30'
                  : 'bg-ocean-800/40 text-ocean-400 border border-ocean-700/30 hover:text-ocean-200'
              }`}
            >
              {SPECIES_ICONS[s] ?? '❓'} {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Track table */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-ocean-950/95 backdrop-blur-sm">
                <tr className="text-ocean-400 text-xs">
                  {(
                    [
                      ['track_id', 'Track ID'],
                      ['class_name', 'Species'],
                      ['confidence', 'Confidence'],
                      ['age', 'Age (frames)'],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left font-semibold cursor-pointer hover:text-ocean-200 select-none"
                      onClick={() => toggleSort(key)}
                    >
                      <div className="flex items-center gap-1">
                        {label}
                        {sortKey === key &&
                          (sortDir === 'asc' ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold">BBox</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-ocean-600"
                    >
                      {sessionActive
                        ? 'No tracks matching filter'
                        : 'Start a session to see tracks'}
                    </td>
                  </tr>
                ) : (
                  filteredTracks.map((t) => (
                    <tr
                      key={t.track_id}
                      className={`border-t border-ocean-800/30 transition-colors cursor-pointer ${
                        selectedTrack?.track_id === t.track_id
                          ? 'bg-biolum-400/10'
                          : 'hover:bg-ocean-800/20'
                      }`}
                      onClick={() => setSelectedTrack(t)}
                    >
                      <td className="px-4 py-3 font-mono text-biolum-400 font-semibold">
                        #{t.track_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {SPECIES_ICONS[t.class_name] ?? '❓'}
                          </span>
                          <span
                            className="capitalize font-medium"
                            style={{ color: SPECIES_COLOURS[t.class_name] }}
                          >
                            {t.class_name.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-ocean-800/50 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${t.confidence * 100}%`,
                                backgroundColor:
                                  t.confidence > 0.7
                                    ? '#00e670'
                                    : t.confidence > 0.5
                                      ? '#ffc832'
                                      : '#ff8533',
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono text-ocean-300">
                            {(t.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ocean-300 font-mono">
                        {t.age}
                      </td>
                      <td className="px-4 py-3 text-ocean-500 font-mono text-xs">
                        [{t.bbox.x1},{t.bbox.y1}]
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg bg-ocean-800/40 hover:bg-ocean-700/40 transition-colors">
                          <Eye className="w-3.5 h-3.5 text-ocean-400" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trajectory detail */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider mb-4">
            Trajectory View
          </h3>
          {selectedTrack ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {SPECIES_ICONS[selectedTrack.class_name] ?? '❓'}
                </span>
                <div>
                  <p
                    className="font-bold capitalize"
                    style={{
                      color: SPECIES_COLOURS[selectedTrack.class_name],
                    }}
                  >
                    {selectedTrack.class_name.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-ocean-400">
                    Track #{selectedTrack.track_id} • Age: {selectedTrack.age}{' '}
                    frames
                  </p>
                </div>
              </div>

              {/* Mini trajectory canvas */}
              <div className="aspect-video bg-ocean-950 rounded-lg border border-ocean-800/30 relative overflow-hidden">
                <svg
                  viewBox="0 0 1280 720"
                  className="w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Grid */}
                  {Array.from({ length: 13 }).map((_, i) => (
                    <line
                      key={`gx-${i}`}
                      x1={i * 100}
                      y1={0}
                      x2={i * 100}
                      y2={720}
                      stroke="rgba(0,230,219,0.05)"
                    />
                  ))}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={`gy-${i}`}
                      x1={0}
                      y1={i * 100}
                      x2={1280}
                      y2={i * 100}
                      stroke="rgba(0,230,219,0.05)"
                    />
                  ))}
                  {/* Trajectory path */}
                  {selectedTrack.trajectory.length > 1 && (
                    <polyline
                      points={selectedTrack.trajectory
                        .map(([x, y]) => `${x},${y}`)
                        .join(' ')}
                      fill="none"
                      stroke={SPECIES_COLOURS[selectedTrack.class_name]}
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={0.7}
                    />
                  )}
                  {/* Current position */}
                  {selectedTrack.trajectory.length > 0 && (
                    <circle
                      cx={
                        selectedTrack.trajectory[
                          selectedTrack.trajectory.length - 1
                        ][0]
                      }
                      cy={
                        selectedTrack.trajectory[
                          selectedTrack.trajectory.length - 1
                        ][1]
                      }
                      r="8"
                      fill={SPECIES_COLOURS[selectedTrack.class_name]}
                      opacity={0.9}
                    />
                  )}
                </svg>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-ocean-950/70 backdrop-blur text-[10px] text-ocean-400 font-mono">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {selectedTrack.trajectory.length} points
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="glass-panel text-center">
                  <p className="text-[10px] text-ocean-500">Confidence</p>
                  <p className="text-lg font-bold text-biolum-400">
                    {(selectedTrack.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="glass-panel text-center">
                  <p className="text-[10px] text-ocean-500">Track Points</p>
                  <p className="text-lg font-bold text-biolum-400">
                    {selectedTrack.trajectory.length}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-ocean-600">
              <MapPin className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">Select a track to view trajectory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
