import React, { useEffect, useState, useCallback } from "react";
import { 
  Play, 
  RotateCcw, 
  RefreshCw, 
  CheckSquare, 
  Square, 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Building2, 
  MapPin, 
  Tag, 
  Search,
  Zap,
  History as HistoryIcon
} from "lucide-react";
import { api } from "../services/api";
import { GOVERNORATES_LIST, CATEGORIES_LIST } from "../data/mockData";
import { DashboardStats, Job, BusinessResult, Failure } from "../types";
import { StatusChip } from "../components/StatusChip";
import { MetricCard } from "../components/MetricCard";
import { JobsTable } from "../components/JobsTable";
import { ResultsTable } from "../components/ResultsTable";

export const ControlDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [results, setResults] = useState<BusinessResult[]>([]);
  const [failures, setFailures] = useState<Failure[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedGovs, setSelectedGovs] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [s, j, r, f] = await Promise.all([
        api.getDashboard(),
        api.getJobs(),
        api.getResults(),
        api.getFailures()
      ]);
      setStats(s);
      setJobs(j);
      setResults(r);
      setFailures(f);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [fetchData]);

  const toggleGov = (gov: string) => {
    setSelectedGovs(prev => 
      prev.includes(gov) ? prev.filter(g => g !== gov) : [...prev, gov]
    );
  };

  const toggleCat = (cat: string) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const selectAllGovs = () => setSelectedGovs(GOVERNORATES_LIST);
  const deselectAllGovs = () => setSelectedGovs([]);
  const selectAllCats = () => setSelectedCats(CATEGORIES_LIST);
  const deselectAllCats = () => setSelectedCats([]);

  const handleStartSelected = async () => {
    if (selectedGovs.length === 0 || selectedCats.length === 0) {
      setError("Please select at least one governorate and one category.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setActionLoading(true);
    try {
      await api.startSelected(selectedGovs, selectedCats);
      fetchData();
    } catch (err) {
      setError("Failed to start selected agents.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartAll = async () => {
    setActionLoading(true);
    try {
      await api.startAll();
      fetchData();
    } catch (err) {
      setError("Failed to start all agents.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Top Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard label="Running Jobs" value={stats?.runningJobs || 0} icon={<Activity size={20} className="text-blue-500" />} />
        <MetricCard label="Pending Jobs" value={stats?.completedJobs ? 0 : 0} icon={<Clock size={20} className="text-slate-400" />} />
        <MetricCard label="Completed Today" value={stats?.completedJobs || 0} icon={<CheckCircle size={20} className="text-green-500" />} />
        <MetricCard label="Failed Jobs" value={stats?.failedJobs || 0} icon={<AlertCircle size={20} className="text-red-500" />} />
        <MetricCard label="Total Saved" value={stats?.totalBusinessesToday || 0} icon={<Building2 size={20} className="text-indigo-500" />} />
        <MetricCard label="Active Govs" value={selectedGovs.length} icon={<MapPin size={20} className="text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Governorate Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Governorate Selection ({selectedGovs.length})
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={selectAllGovs}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                Select All
              </button>
              <button 
                onClick={deselectAllGovs}
                className="text-xs font-semibold text-slate-500 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GOVERNORATES_LIST.map(gov => (
              <button
                key={gov}
                onClick={() => toggleGov(gov)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedGovs.includes(gov)
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {selectedGovs.includes(gov) ? <CheckSquare size={16} /> : <Square size={16} />}
                {gov}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Tag size={20} className="text-indigo-600" />
              Category Selection ({selectedCats.length})
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={selectAllCats}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded transition-colors"
              >
                Select All
              </button>
              <button 
                onClick={deselectAllCats}
                className="text-xs font-semibold text-slate-500 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES_LIST.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedCats.includes(cat)
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {selectedCats.includes(cat) ? <CheckSquare size={16} /> : <Square size={16} />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartSelected}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
          >
            {actionLoading ? <RefreshCw size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            Start Selected
          </button>
          <button
            onClick={handleStartAll}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-200"
          >
            <Zap size={18} fill="currentColor" />
            Start All Governorates
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <button 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
          >
            <RotateCcw size={18} />
            Retry Failed Jobs
          </button>
        </div>
        {error && (
          <div className="w-full mt-2 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Active Progress Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity size={24} className="text-blue-600" />
            Active Progress
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {jobs.length} Jobs Running
          </span>
        </div>
        <JobsTable jobs={jobs} />
      </div>

      {/* Recent Businesses Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HistoryIcon size={24} className="text-indigo-600" />
            Recent Businesses
          </h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter results..." 
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
            />
          </div>
        </div>
        <ResultsTable results={results} />
      </div>

      {/* Failed Jobs Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle size={24} className="text-red-600" />
            Failed Jobs
          </h2>
          <button className="text-sm font-bold text-red-600 hover:underline">
            Clear All Failures
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Governorate / City</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Error Message</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Retry Count</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {failures.map(fail => (
                <tr key={fail.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{fail.governorate}</span>
                      <span className="text-xs text-slate-500">{fail.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fail.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                      <AlertCircle size={14} />
                      {fail.errorMessage}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fail.retryCount}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => api.retryJob(fail.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      <RotateCcw size={12} />
                      Retry
                    </button>
                  </td>
                </tr>
              ))}
              {failures.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No failed jobs detected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
