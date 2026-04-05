import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Activity, 
  History as HistoryIcon, 
  AlertCircle, 
  Settings,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User
} from "lucide-react";
import { OverviewPage } from "./pages/OverviewPage";
import { GovernoratesPage } from "./pages/GovernoratesPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ActiveJobsPage } from "./pages/ActiveJobsPage";
import { RecentResultsPage } from "./pages/RecentResultsPage";
import { FailuresPage } from "./pages/FailuresPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ControlDashboard } from "./pages/ControlDashboard";

type Page = "control" | "overview" | "governorates" | "categories" | "jobs" | "results" | "failures" | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("control");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: "control", label: "Control Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "overview", label: "System Overview", icon: <Activity size={20} /> },
    { id: "governorates", label: "Governorates", icon: <Users size={20} /> },
    { id: "jobs", label: "Active Jobs", icon: <Activity size={20} /> },
    { id: "results", label: "Recent Results", icon: <HistoryIcon size={20} /> },
    { id: "failures", label: "Failures / Retry", icon: <AlertCircle size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "control": return <ControlDashboard />;
      case "overview": return <OverviewPage />;
      case "governorates": return <GovernoratesPage />;
      case "categories": return <CategoriesPage />;
      case "jobs": return <ActiveJobsPage />;
      case "results": return <RecentResultsPage />;
      case "failures": return <FailuresPage />;
      case "settings": return <SettingsPage />;
      default: return <ControlDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200 fixed lg:static inset-y-0 left-0 z-50 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Activity className="text-white w-5 h-5" />
            </div>
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-lg tracking-tight text-slate-800 whitespace-nowrap">
                Governor Agent
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  currentPage === item.id 
                    ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className={`transition-colors ${currentPage === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                  {item.icon}
                </div>
                {isSidebarOpen && <span>{item.label}</span>}
                {isSidebarOpen && currentPage === item.id && (
                  <ChevronRight size={14} className="ml-auto text-blue-400" />
                )}
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          {isSidebarOpen && (
            <div className="p-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Backend Online</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Last sync: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest hidden sm:block">
              {navItems.find(n => n.id === currentPage)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64"
              />
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">Admin Operator</p>
                <p className="text-[10px] text-slate-500">Superuser</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}
    </div>
  );
}
