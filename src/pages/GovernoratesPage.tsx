import React, { useEffect, useState } from "react";
import { GovernorateCard } from "../components/GovernorateCard";
import { api } from "../services/api";
import { Governorate } from "../types";
import { Search, Filter, Play } from "lucide-react";

export const GovernoratesPage: React.FC = () => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGovernorates = async () => {
      const data = await api.getGovernorates();
      setGovernorates(data);
      setLoading(false);
    };
    fetchGovernorates();
  }, []);

  const filtered = governorates.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase())
  );

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
              placeholder="Search governorates..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
        <button 
          onClick={() => api.startAll()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-200"
        >
          <Play size={16} fill="currentColor" /> Start All Agents
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((gov) => (
          <GovernorateCard 
            key={gov.id} 
            governorate={gov} 
            onStart={(id) => api.startGovernorate(id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">No governorates found matching your search.</p>
        </div>
      )}
    </div>
  );
};
