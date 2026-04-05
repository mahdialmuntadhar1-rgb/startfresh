import React from "react";
import { Governorate } from "../types";
import { StatusChip } from "./StatusChip";
import { Play, Pause, RotateCcw, Info } from "lucide-react";

interface GovernorateCardProps {
  governorate: Governorate;
  onStart?: (id: string) => void;
  onPause?: (id: string) => void;
  onRetry?: (id: string) => void;
  onView?: (id: string) => void;
}

export const GovernorateCard: React.FC<GovernorateCardProps> = ({ 
  governorate, onStart, onPause, onRetry, onView 
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{governorate.name}</h3>
        <StatusChip status={governorate.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs">Cities</span>
          <span className="font-semibold text-slate-800">{governorate.citiesCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs">Categories</span>
          <span className="font-semibold text-slate-800">{governorate.categoriesCompleted} / {governorate.totalCategories}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs">Businesses</span>
          <span className="font-semibold text-slate-800">{governorate.businessesCollected.toLocaleString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs">Progress</span>
          <span className="font-semibold text-slate-800">{governorate.progress}%</span>
        </div>
      </div>

      {governorate.status === "running" && (
        <div className="mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500">Active: <span className="font-medium text-slate-800">{governorate.activeCity}</span></span>
            <span className="text-slate-500">Category: <span className="font-medium text-slate-800">{governorate.activeCategory}</span></span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
              style={{ width: `${governorate.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {governorate.status === "pending" || governorate.status === "done" ? (
          <button 
            onClick={() => onStart?.(governorate.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Play size={14} fill="currentColor" /> Start
          </button>
        ) : governorate.status === "running" ? (
          <button 
            onClick={() => onPause?.(governorate.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Pause size={14} fill="currentColor" /> Pause
          </button>
        ) : (
          <button 
            onClick={() => onRetry?.(governorate.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <RotateCcw size={14} /> Retry
          </button>
        )}
        <button 
          onClick={() => onView?.(governorate.id)}
          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors border border-slate-100"
          title="View Details"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};
