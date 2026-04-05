import React, { useEffect, useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { LogPanel } from "../components/LogPanel";
import { StatusChip } from "../components/StatusChip";
import { api } from "../services/api";
import { DashboardStats } from "../types";
import { 
  Users, 
  Layers, 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Play, 
  RotateCcw, 
  History as HistoryIcon,
  TrendingUp,
  Server,
  Zap
} from "lucide-react";

export const OverviewPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.getDashboard();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard label="Governorates" value={stats.totalGovernorates} icon={<Users size={20} />} />
        <MetricCard label="Categories" value={stats.totalCategories} icon={<Layers size={20} />} />
        <MetricCard label="Running Jobs" value={stats.runningJobs} icon={<Activity size={20} />} trendColor="blue" />
        <MetricCard label="Completed Jobs" value={stats.completedJobs} icon={<CheckCircle size={20} />} trendColor="green" />
        <MetricCard label="Failed Jobs" value={stats.failedJobs} icon={<AlertCircle size={20} />} trendColor="red" />
        <MetricCard label="Businesses Today" value={stats.totalBusinessesToday} icon={<TrendingUp size={20} />} trendColor="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap size={24} className="text-blue-600" />
                Overall Progress
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => api.startAll()}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-200"
                >
                  <Play size={16} fill="currentColor" /> Start All
                </button>
                <button 
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <RotateCcw size={16} /> Resume
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">System Completion</span>
                <span className="text-2xl font-bold text-slate-900">{stats.overallProgress}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${stats.overallProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Agents</span>
                  <span className="text-lg font-bold text-slate-800">12 / 18</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg. Time / City</span>
                  <span className="text-lg font-bold text-slate-800">4.2m</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Success Rate</span>
                  <span className="text-lg font-bold text-green-600">92.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Server size={24} className="text-slate-400" />
              System Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Database size={20} className="text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Database</span>
                  <StatusChip status={stats.systemHealth.database} />
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Activity size={20} className="text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Queue</span>
                  <StatusChip status={stats.systemHealth.queue} />
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Server size={20} className="text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Backend</span>
                  <StatusChip status={stats.systemHealth.backend} />
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <HistoryIcon size={20} className="text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Last Sync</span>
                  <span className="text-xs font-bold text-slate-700">{new Date(stats.systemHealth.lastSync).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="lg:col-span-1">
          <LogPanel />
        </div>
      </div>
    </div>
  );
};
