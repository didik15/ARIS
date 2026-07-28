import React from 'react';
import { 
  FileText, 
  Users, 
  BellRing, 
  Bot, 
  BookOpen, 
  Database, 
  Plus, 
  Sparkles,
  ShieldAlert,
  Building2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'documents' | 'clients' | 'services' | 'ai-assistant' | 'backup';
  setActiveTab: (tab: 'dashboard' | 'documents' | 'clients' | 'services' | 'ai-assistant' | 'backup') => void;
  criticalCount: number;
  expiredCount: number;
  warningCount: number;
  onOpenAddClient: () => void;
  onOpenAddDocument: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  expiredCount,
  warningCount,
  onOpenAddClient,
  onOpenAddDocument,
}) => {
  const totalUrgent = criticalCount + expiredCount;

  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-md shadow-blue-500/20 shrink-0">
            A
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg md:text-xl tracking-tight text-slate-900">
                A.R.I.S.
              </h1>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Integrated System
              </span>
              <span className="hidden sm:inline-flex items-center text-xs text-slate-500 border-l border-slate-200 pl-2">
                <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Synergy Success Consultant
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Application Reminding Integrated System — Passport, KITAS & Expat Document Management
            </p>
          </div>
        </div>

        {/* System Status & Admin Profile & Primary Actions */}
        <div className="flex items-center space-x-3 flex-wrap">
          <div className="hidden lg:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-800 font-medium text-[11px]">Auto Reminders Active</span>
          </div>

          {totalUrgent > 0 && (
            <button
              onClick={() => setActiveTab('documents')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{totalUrgent} Attention Needed! ({expiredCount} Expired)</span>
            </button>
          )}

          <button
            onClick={onOpenAddClient}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Add Client</span>
          </button>

          <button
            onClick={onOpenAddDocument}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Document Record</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BellRing className="w-4 h-4 text-blue-600" />
            <span>Dashboard & Reminders</span>
            {totalUrgent > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-rose-600 text-white font-bold">
                {totalUrgent}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'documents'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Passports & KITAS</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'clients'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Clients & Sponsors</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'services'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Service Catalog</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ai-assistant'
                ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-600" />
            <span>A.R.I.S. AI Assistant</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-800 rounded">
              Gemini AI
            </span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Database className="w-4 h-4 text-blue-600" />
            <span>Backup & Data</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
