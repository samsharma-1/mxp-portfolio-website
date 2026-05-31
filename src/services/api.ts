import axios from 'axios';
import type {
  HealthCheckResponse,
  StreamStartRequest,
  StreamStatusResponse,
  StreamStopResponse,
  MetricsSnapshot,
  MetricsHistoryResponse,
  SpeciesCountsResponse,
  PlasticDensityResponse,
  ActiveTracksResponse,
  ReportGenerateRequest,
  ReportGenerateResponse,
  ReportsListResponse,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Health ────────────────────────────────────────────────────────

export const getHealth = () =>
  api.get<HealthCheckResponse>('/api/v1/health').then((r) => r.data);

// ── Stream ───────────────────────────────────────────────────────

export const startStream = (data: StreamStartRequest) =>
  api.post<{ session_id: string; status: string }>('/api/v1/stream/start', data).then((r) => r.data);

export const stopStream = () =>
  api.post<StreamStopResponse>('/api/v1/stream/stop').then((r) => r.data);

export const getStreamStatus = () =>
  api.get<StreamStatusResponse>('/api/v1/stream/status').then((r) => r.data);

// ── Metrics ──────────────────────────────────────────────────────

export const getLatestMetrics = () =>
  api.get<MetricsSnapshot>('/api/v1/metrics/latest').then((r) => r.data);

export const getMetricsHistory = (minutes: number = 10) =>
  api.get<MetricsHistoryResponse>(`/api/v1/metrics/history?minutes=${minutes}`).then((r) => r.data);

// ── Species ──────────────────────────────────────────────────────

export const getSpeciesCounts = () =>
  api.get<SpeciesCountsResponse>('/api/v1/species/counts').then((r) => r.data);

// ── Plastic ──────────────────────────────────────────────────────

export const getPlasticDensity = () =>
  api.get<PlasticDensityResponse>('/api/v1/plastic/density').then((r) => r.data);

// ── Tracks ───────────────────────────────────────────────────────

export const getActiveTracks = () =>
  api.get<ActiveTracksResponse>('/api/v1/tracks/active').then((r) => r.data);

// ── Reports ──────────────────────────────────────────────────────

export const generateReport = (data: ReportGenerateRequest) =>
  api.post<ReportGenerateResponse>('/api/v1/report/generate', data).then((r) => r.data);

export const listReports = () =>
  api.get<ReportsListResponse>('/api/v1/report/list').then((r) => r.data);

export const getReportDownloadUrl = (reportId: string) =>
  `${BASE_URL}/api/v1/report/download/${reportId}`;

export default api;
