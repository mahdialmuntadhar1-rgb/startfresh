import React from "react";
import { Job } from "../types";
import { StatusChip } from "./StatusChip";
import { RotateCcw, XCircle, Eye } from "lucide-react";

interface JobsTableProps {
  jobs: Job[];
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
}

export const JobsTable: React.FC<JobsTableProps> = ({ jobs, onRetry, onCancel, onView }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Governorate</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">City / Category</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated At</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-mono text-slate-500">{job.id}</td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">{job.governorate}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">{job.city}</span>
                  <span className="text-xs text-slate-400">{job.category}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{job.savedCount} / {job.targetCount}</span>
                    <span className="font-bold text-slate-700">{job.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 italic truncate">{job.currentStep}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusChip status={job.status} />
              </td>
              <td className="px-6 py-4 text-xs text-slate-500">
                {new Date(job.updatedAt).toLocaleTimeString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onView?.(job.id)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                    title="View Details"
                  >
                    <Eye size={14} />
                  </button>
                  {job.status === "failed" && (
                    <button 
                      onClick={() => onRetry?.(job.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                      title="Retry Job"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  {job.status === "running" && (
                    <button 
                      onClick={() => onCancel?.(job.id)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                      title="Cancel Job"
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
