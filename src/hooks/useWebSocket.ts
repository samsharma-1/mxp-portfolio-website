import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { WebSocketMessage } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws/live';
const MAX_RECONNECT_DELAY = 30000;

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(1000);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const { setLiveData, setConnected } = useDashboardStore();

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        setConnected(true);
        reconnectDelay.current = 1000; // Reset backoff
        console.log('🌊 WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          setLiveData(data);
        } catch {
          console.warn('Invalid WS message');
        }
      };

      ws.current.onclose = (e) => {
        setConnected(false);
        console.log(`WebSocket closed (${e.code}), reconnecting in ${reconnectDelay.current}ms…`);

        // Exponential backoff
        reconnectTimer.current = setTimeout(() => {
          reconnectDelay.current = Math.min(
            reconnectDelay.current * 1.5,
            MAX_RECONNECT_DELAY
          );
          connect();
        }, reconnectDelay.current);
      };

      ws.current.onerror = (e) => {
        console.error('WebSocket error:', e);
      };
    } catch (err) {
      console.error('WS connection failed:', err);
      reconnectTimer.current = setTimeout(connect, reconnectDelay.current);
    }
  }, [setConnected, setLiveData]);

  const sendMessage = useCallback((msg: Record<string, unknown>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);

  return { sendMessage };
}
