/**
 * TypeScript interfaces matching all backend Pydantic schemas.
 */

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectionItem {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: BoundingBox;
  track_id?: number;
}

export interface TrackItem {
  track_id: number;
  class_id: number;
  class_name: string;
  bbox: BoundingBox;
  confidence: number;
  age: number;
  trajectory: [number, number][];
}

// ── Health Check ────────────────────────────────────────────────

export interface ModelStatus {
  name: string;
  loaded: boolean;
  engine_type: string;
  latency_ms?: number;
}

export interface HealthCheckResponse {
  status: string;
  uptime_seconds: number;
  camera_connected: boolean;
  gpu_utilisation_pct?: number;
  models: ModelStatus[];
  simulation_mode: boolean;
}

// ── Stream ──────────────────────────────────────────────────────

export interface StreamStartRequest {
  source: string | number;
  resolution: number[];
}

export interface StreamStatusResponse {
  active: boolean;
  session_id?: string;
  fps: number;
  frame_count: number;
  uptime_seconds: number;
  resolution: number[];
  camera_source: string;
}

export interface StreamStopResponse {
  session_id: string;
  total_frames: number;
  duration_seconds: number;
}

// ── Metrics ─────────────────────────────────────────────────────

export interface MetricsSnapshot {
  timestamp: string;
  frame_id: number;
  health_score: number;
  health_trend: 'improving' | 'stable' | 'declining';
  species_counts: Record<string, number>;
  total_unique_tracks: number;
  microplastic_density: number;
  pollution_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  macro_plastic_count: number;
  active_alerts: string[];
  visibility_score: number;
  fps: number;
}

export interface MetricsHistoryResponse {
  session_id?: string;
  minutes: number;
  data_points: MetricsSnapshot[];
}

// ── Species ─────────────────────────────────────────────────────

export interface SpeciesCountsResponse {
  session_id?: string;
  counts: Record<string, number>;
  total: number;
}

// ── Plastic ─────────────────────────────────────────────────────

export interface PlasticDensityResponse {
  microplastic_density: number;
  pollution_level: string;
  macro_plastic_count: number;
  heatmap_b64?: string;
  particle_types: Record<string, number>;
}

// ── Tracks ──────────────────────────────────────────────────────

export interface ActiveTracksResponse {
  count: number;
  tracks: TrackItem[];
}

// ── Reports ─────────────────────────────────────────────────────

export interface ReportGenerateRequest {
  session_id: string;
  include_tracks: boolean;
}

export interface ReportGenerateResponse {
  report_id: string;
  status: string;
  download_url?: string;
}

export interface ReportInfo {
  report_id: string;
  session_id: string;
  created_at: string;
  file_size_bytes: number;
  download_url: string;
}

export interface ReportsListResponse {
  reports: ReportInfo[];
}

// ── WebSocket ───────────────────────────────────────────────────

export interface WebSocketMessage {
  timestamp: string;
  frame_id: number;
  fps: number;
  health_score: number;
  health_trend: 'improving' | 'stable' | 'declining';
  species_counts: Record<string, number>;
  total_unique_tracks: number;
  microplastic_density: number;
  pollution_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  active_alerts: string[];
  visibility_score: number;
  enhanced_frame_b64: string;
  detection_overlay_b64: string;
}

// ── Settings ────────────────────────────────────────────────────

export interface SettingsResponse {
  confidence_thresholds: Record<string, number>;
  camera_source: string;
  camera_resolution: number[];
  simulation_mode: boolean;
  health_update_interval_s: number;
  max_lost_frames: number;
  patch_size: number;
  patch_stride: number;
}

// ── Alerts ──────────────────────────────────────────────────────

export interface AlertItem {
  id: number;
  alert_type: string;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

// ── UI Helpers ──────────────────────────────────────────────────

export const SPECIES_COLOURS: Record<string, string> = {
  fish: '#00ff80',
  coral: '#00c8ff',
  macroplastic: '#ff3333',
  jellyfish: '#ff80ff',
  sea_turtle: '#00ffff',
  crab: '#8080ff',
  unknown_organism: '#c8c8c8',
};

export const SPECIES_ICONS: Record<string, string> = {
  fish: '🐟',
  coral: '🪸',
  macroplastic: '🗑️',
  jellyfish: '🪼',
  sea_turtle: '🐢',
  crab: '🦀',
  unknown_organism: '❓',
};

export const POLLUTION_COLOURS: Record<string, string> = {
  Low: '#00e670',
  Moderate: '#ffc832',
  High: '#ff8533',
  Critical: '#ff3333',
};
