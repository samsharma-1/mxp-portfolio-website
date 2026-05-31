import { SPECIES_COLOURS } from '@/types';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  glowClass?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = '#00e6db',
  glowClass,
}: StatCardProps) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendColor =
    trend === 'up'
      ? 'text-marine-400'
      : trend === 'down'
        ? 'text-pollution-400'
        : 'text-ocean-400';

  return (
    <div
      className={`glass-card-hover p-4 ${glowClass || ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-ocean-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-bold"
          style={{ color }}
        >
          {value}
        </span>
        {trend && (
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendIcon}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-ocean-400 mt-1">{subtitle}</p>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-40"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
