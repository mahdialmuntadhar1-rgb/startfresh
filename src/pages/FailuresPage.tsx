import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Failure } from "../types";
import { Search, Filter, RotateCcw, AlertTriangle, Eye } from "lucide-react";

export const FailuresPage: React.FC = () => {
  const [failures, setFailures] = useState<Failure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFailures = async () => {
      const data = await api.getFailures();
      setFailures(data);
      setLoading(false);
    };
    fetchFailures();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search failures..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-red-200">
          <RotateCcw size={16} /> Retry All Failed
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-800">Failed Jobs</h2>
          <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100">
            {failures.length} issues detected
          </span>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Governorate / City</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Error Message</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Retry Count</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Attempt</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {failures.map((fail) => (
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
                      <AlertTriangle size={14} />
                      {fail.errorMessage}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{fail.retryCount}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(fail.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => api.retryJob(fail.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                        title="Retry Job"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button 
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                        title="View Logs"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {failures.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">No failed jobs found. System is healthy.</p>
        </div>
      )}
    </div>
  );
};
