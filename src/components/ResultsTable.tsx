import React from "react";
import { BusinessResult } from "../types";
import { StatusChip } from "./StatusChip";
import { Phone, MapPin, ExternalLink } from "lucide-react";

interface ResultsTableProps {
  results: BusinessResult[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source / Confidence</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Verification</th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {results.map((res) => (
            <tr key={res.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">{res.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{res.id}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-800">
                    <MapPin size={12} className="text-slate-400" />
                    {res.governorate}
                  </div>
                  <span className="text-xs text-slate-500 ml-4">{res.city}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">{res.category}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-mono">
                  <Phone size={12} className="text-slate-400" />
                  {res.phone}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                    <ExternalLink size={12} className="text-blue-500" />
                    {res.source}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${res.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">{(res.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusChip status={res.verificationStatus} />
              </td>
              <td className="px-6 py-4 text-xs text-slate-500">
                {new Date(res.savedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
