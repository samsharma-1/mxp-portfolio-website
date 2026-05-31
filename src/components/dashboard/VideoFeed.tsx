import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Camera, CameraOff } from 'lucide-react';

export default function VideoFeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveData = useDashboardStore((s) => s.liveData);
  const connected = useDashboardStore((s) => s.connected);

  useEffect(() => {
    if (!liveData?.detection_overlay_b64 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw frame info overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, 200, 30);
      ctx.fillStyle = '#00e6db';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(
        `Frame: ${liveData.frame_id}  |  FPS: ${liveData.fps.toFixed(1)}`,
        8,
        20
      );
    };
    img.src = `data:image/jpeg;base64,${liveData.detection_overlay_b64}`;
  }, [liveData?.detection_overlay_b64, liveData?.frame_id]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-biolum-400/10">
        <div className="flex items-center gap-2">
          {connected ? (
            <Camera className="w-4 h-4 text-biolum-400" />
          ) : (
            <CameraOff className="w-4 h-4 text-ocean-500" />
          )}
          <span className="text-sm font-medium text-ocean-200">
            Live Feed
          </span>
        </div>
        {connected && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-pollution-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-pollution-400 uppercase tracking-widest">
              REC
            </span>
          </div>
        )}
      </div>

      <div className="relative aspect-video bg-ocean-950 flex items-center justify-center">
        {liveData?.detection_overlay_b64 ? (
          <canvas
            ref={canvasRef}
            className="video-canvas w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-ocean-500">
            <CameraOff className="w-12 h-12 opacity-30" />
            <p className="text-sm">
              {connected ? 'Waiting for frames…' : 'No video feed'}
            </p>
            <p className="text-xs text-ocean-600">
              Start a session to begin monitoring
            </p>
          </div>
        )}

        {/* Live indicator overlay */}
        {liveData && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-ocean-950/70 backdrop-blur-sm border border-biolum-400/20">
            <span className="text-[10px] font-mono text-biolum-400">
              {liveData.fps.toFixed(1)} FPS
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
