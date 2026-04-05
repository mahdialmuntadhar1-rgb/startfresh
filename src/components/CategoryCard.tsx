import React from "react";
import { Category } from "../types";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {category.totalSaved.toLocaleString()} Saved
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Governorates Completed</span>
          <span className="font-semibold text-slate-800">{category.governoratesCompleted} / 18</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Active Governorates</span>
          <span className="font-semibold text-blue-600">{category.activeGovernorates}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Overall Progress</span>
          <span className="font-bold text-slate-600">{category.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${category.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
