import React from "react";
import { Save, Globe, RefreshCw, Database, Shield, Bell } from "lucide-react";

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe size={24} className="text-blue-600" />
            API & Backend Settings
          </h2>
          <p className="text-sm text-slate-500 mt-1">Configure how the dashboard communicates with the agent system.</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Backend API Base URL</label>
              <input 
                type="text" 
                defaultValue="https://api.governor-agent.iq/v1"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400">The root URL for all agent control operations.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Refresh Interval (Seconds)</label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                <option value="5">5 Seconds</option>
                <option value="15">15 Seconds</option>
                <option value="30">30 Seconds</option>
                <option value="60">60 Seconds</option>
              </select>
              <p className="text-[10px] text-slate-400">How often the dashboard polls for job updates.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database size={24} className="text-indigo-600" />
            Collection Parameters
          </h2>
          <p className="text-sm text-slate-500 mt-1">Fine-tune the scraping and verification logic.</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Max Retries Per Job</label>
              <input 
                type="number" 
                defaultValue={3}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Verification Confidence Threshold</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="85"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0%</span>
                <span>85%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors">
          Reset Defaults
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
};
