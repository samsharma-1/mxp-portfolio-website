import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listReports, generateReport, getReportDownloadUrl } from '@/services/api';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  FileText,
  Download,
  Loader2,
  Plus,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { format } from 'date-fns';

export default function Reports() {
  const queryClient = useQueryClient();
  const { sessionId } = useDashboardStore();
  const [includeTracts, setIncludeTracks] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: listReports,
    refetchInterval: 10000,
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      generateReport({
        session_id: sessionId ?? 'demo-session',
        include_tracks: includeTracts,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const reports = data?.reports ?? [];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Reports</h2>
          <p className="text-sm text-ocean-400">
            Generate and download CSV reports from monitoring sessions
          </p>
        </div>
      </div>

      {/* Generate report card */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-4">
          Generate New Report
        </h3>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs text-ocean-400 mb-1.5">
              Session
            </label>
            <div className="px-3 py-2 bg-ocean-900/50 border border-ocean-700/40 rounded-lg text-sm text-ocean-200 font-mono">
              {sessionId ? sessionId.slice(0, 12) + '…' : 'demo-session'}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTracts}
              onChange={(e) => setIncludeTracks(e.target.checked)}
              className="w-4 h-4 rounded border-ocean-600 bg-ocean-900 text-biolum-400 focus:ring-biolum-400/30"
            />
            <span className="text-sm text-ocean-300">Include track data</span>
          </label>

          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-biolum-400/20 text-biolum-400 border border-biolum-400/30 font-semibold text-sm hover:bg-biolum-400/30 hover:shadow-glow-cyan transition-all disabled:opacity-50"
          >
            {generateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Generate Report
          </button>
        </div>

        {generateMutation.isSuccess && (
          <div className="mt-3 text-sm text-marine-400 flex items-center gap-2">
            ✓ Report generated successfully!
            {generateMutation.data?.download_url && (
              <a
                href={getReportDownloadUrl(generateMutation.data.report_id)}
                className="underline hover:text-marine-300"
              >
                Download now
              </a>
            )}
          </div>
        )}
      </div>

      {/* Reports list */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-3 border-b border-biolum-400/10">
          <h3 className="text-xs font-semibold text-ocean-400 uppercase tracking-wider">
            Report History ({reports.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-ocean-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading reports…
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-ocean-600">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">No reports generated yet</p>
            <p className="text-xs text-ocean-700 mt-1">
              Generate your first report above
            </p>
          </div>
        ) : (
          <div className="divide-y divide-ocean-800/30">
            {reports.map((report) => (
              <div
                key={report.report_id}
                className="flex items-center justify-between px-4 py-4 hover:bg-ocean-800/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-biolum-400/10 border border-biolum-400/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-biolum-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Report #{report.report_id}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-ocean-400">
                        <Calendar className="w-3 h-3" />
                        {report.created_at
                          ? format(
                              new Date(report.created_at),
                              'MMM d, yyyy HH:mm',
                            )
                          : 'Unknown date'}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-ocean-400">
                        <HardDrive className="w-3 h-3" />
                        {formatBytes(report.file_size_bytes)}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={getReportDownloadUrl(report.report_id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ocean-800/40 text-ocean-200 text-sm font-medium hover:bg-ocean-700/40 hover:text-white transition-colors border border-ocean-700/30"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
