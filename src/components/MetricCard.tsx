import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendColor?: "green" | "red" | "blue";
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, trend, trendColor = "blue" }) => {
  const getTrendStyles = () => {
    switch (trendColor) {
      case "green": return "text-green-600 bg-green-50 border-green-100";
      case "red": return "text-red-600 bg-red-50 border-red-100";
      case "blue": return "text-blue-600 bg-blue-50 border-blue-100";
      default: return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getTrendStyles()}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
