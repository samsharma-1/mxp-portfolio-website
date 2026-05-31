import VideoFeed from '@/components/dashboard/VideoFeed';
import HealthGauge from '@/components/dashboard/HealthGauge';
import SpeciesCountCards from '@/components/dashboard/SpeciesCountCards';
import SpeciesTimeline from '@/components/dashboard/SpeciesTimeline';
import PlasticBarChart from '@/components/dashboard/PlasticBarChart';
import MicroplasticHeatmap from '@/components/dashboard/MicroplasticHeatmap';
import ActiveTracksTable from '@/components/dashboard/ActiveTracksTable';
import StatCard from '@/components/shared/StatCard';
import { useDashboardStore } from '@/store/dashboardStore';

export default function Dashboard() {
  const liveData = useDashboardStore((s) => s.liveData);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Health Score"
          value={liveData?.health_score?.toFixed(0) ?? '—'}
          subtitle={liveData?.health_trend ?? 'waiting'}
          icon="💚"
          trend={
            liveData?.health_trend === 'improving'
              ? 'up'
              : liveData?.health_trend === 'declining'
                ? 'down'
                : 'stable'
          }
          color={
            (liveData?.health_score ?? 100) >= 70
              ? '#00e670'
              : (liveData?.health_score ?? 100) >= 40
                ? '#ffc832'
                : '#ff3333'
          }
        />
        <StatCard
          title="Visibility"
          value={
            liveData
              ? `${(liveData.visibility_score * 100).toFixed(0)}%`
              : '—'
          }
          subtitle="Underwater clarity"
          icon="👁️"
          color="#0099e6"
        />
        <StatCard
          title="Microplastic"
          value={liveData?.microplastic_density?.toFixed(3) ?? '—'}
          subtitle={`p/m² — ${liveData?.pollution_level ?? 'N/A'}`}
          icon="🔬"
          color={
            (liveData?.microplastic_density ?? 0) < 0.3
              ? '#00e670'
              : (liveData?.microplastic_density ?? 0) < 0.7
                ? '#ffc832'
                : '#ff3333'
          }
        />
        <StatCard
          title="Active Tracks"
          value={liveData?.total_unique_tracks ?? '—'}
          subtitle="Unique objects tracked"
          icon="📍"
          color="#00e6db"
        />
      </div>

      {/* Main grid — Video + Health Gauge + Species */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <VideoFeed />
        </div>
        <div className="space-y-4">
          <HealthGauge />
          <SpeciesCountCards />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SpeciesTimeline />
        <PlasticBarChart />
        <MicroplasticHeatmap />
      </div>

      {/* Tracks table */}
      <ActiveTracksTable />
    </div>
  );
}
