import React from "react";
import { Terminal, Clock, Info, AlertTriangle, CheckCircle } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  governorate?: string;
}

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: new Date().toISOString(), level: "info", message: "System initialized. Backend online.", governorate: "System" },
  { id: "2", timestamp: new Date().toISOString(), level: "success", message: "Baghdad: Karrada - Restaurants collection complete. 45 businesses saved.", governorate: "Baghdad" },
  { id: "3", timestamp: new Date().toISOString(), level: "info", message: "Basra: Al-Ashar - Pharmacies collection started.", governorate: "Basra" },
  { id: "4", timestamp: new Date().toISOString(), level: "warn", message: "Erbil: Ankawa - Facebook source returned 0 results. Retrying with Google Maps.", governorate: "Erbil" },
  { id: "5", timestamp: new Date().toISOString(), level: "error", message: "Kirkuk: Central - Schools collection failed. Connection Timeout.", governorate: "Kirkuk" },
];

export const LogPanel: React.FC = () => {
  const getIcon = (level: string) => {
    switch (level) {
      case "info": return <Info size={14} className="text-blue-500" />;
      case "warn": return <AlertTriangle size={14} className="text-yellow-500" />;
      case "error": return <AlertTriangle size={14} className="text-red-500" />;
      case "success": return <CheckCircle size={14} className="text-green-500" />;
      default: return <Info size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
          <Terminal size={16} />
          System Logs
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Live</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {mockLogs.map((log) => (
          <div key={log.id} className="flex gap-3 group">
            <div className="flex flex-col items-center gap-1 mt-0.5">
              <Clock size={12} className="text-slate-600" />
              <div className="w-px flex-1 bg-slate-800 group-last:bg-transparent" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(log.level)}
                  <span className={`font-bold uppercase text-[10px] ${
                    log.level === "info" ? "text-blue-400" :
                    log.level === "warn" ? "text-yellow-400" :
                    log.level === "error" ? "text-red-400" :
                    "text-green-400"
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-600">[{log.governorate}]</span>
                </div>
                <span className="text-slate-700">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-800 px-4 py-2 border-t border-slate-700">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="font-bold">Status:</span>
          <span>Ready for operations.</span>
        </div>
      </div>
    </div>
  );
};
