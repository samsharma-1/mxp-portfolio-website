import { create } from 'zustand';
import type { WebSocketMessage } from '@/types';

interface DashboardStore {
  connected: boolean;
  liveData: WebSocketMessage | null;
  history: WebSocketMessage[];
  alerts: string[];
  sessionActive: boolean;
  sessionId: string | null;

  setConnected: (v: boolean) => void;
  setLiveData: (d: WebSocketMessage) => void;
  addAlert: (msg: string) => void;
  dismissAlert: (idx: number) => void;
  clearAlerts: () => void;
  setSessionActive: (active: boolean, id?: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  connected: false,
  liveData: null,
  history: [],
  alerts: [],
  sessionActive: false,
  sessionId: null,

  setConnected: (connected) => set({ connected }),

  setLiveData: (d) =>
    set((state) => ({
      liveData: d,
      // Keep last 600 data points (~10 min at 1/second)
      history: [...state.history.slice(-599), d],
      // Merge new alerts
      alerts: [
        ...state.alerts,
        ...d.active_alerts.filter((a) => !state.alerts.includes(a)),
      ].slice(-50),
    })),

  addAlert: (msg) =>
    set((state) => ({
      alerts: [...state.alerts, msg].slice(-50),
    })),

  dismissAlert: (idx) =>
    set((state) => ({
      alerts: state.alerts.filter((_, i) => i !== idx),
    })),

  clearAlerts: () => set({ alerts: [] }),

  setSessionActive: (active, id) =>
    set({ sessionActive: active, sessionId: id ?? null }),
}));
