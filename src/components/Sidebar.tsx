import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  BellRing, 
  BookOpen, 
  Database, 
  Plus, 
  ShieldAlert,
  Building2,
  Menu,
  X,
  Palette,
  Check
} from 'lucide-react';

export type TabType = 'dashboard' | 'documents' | 'clients' | 'services' | 'backup';
export type ThemeColor = 'blue' | 'emerald' | 'indigo' | 'slate';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  criticalCount: number;
  expiredCount: number;
  warningCount: number;
  onOpenAddClient: () => void;
  onOpenAddDocument: () => void;
  currentTheme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  expiredCount,
  warningCount,
  onOpenAddClient,
  onOpenAddDocument,
  currentTheme,
  setTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const totalUrgent = criticalCount + expiredCount;

  // Dynamic theme style helpers
  const themeAccentBg = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
    slate: 'bg-slate-800 hover:bg-slate-900 text-white shadow-slate-800/20',
  }[currentTheme];

  const activeTabStyle = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
    slate: 'bg-slate-100 text-slate-900 border-slate-300 font-bold',
  }[currentTheme];

  const activeIconColor = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    indigo: 'text-indigo-600',
    slate: 'text-slate-800',
  }[currentTheme];

  const logoBg = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    indigo: 'bg-indigo-600',
    slate: 'bg-slate-800',
  }[currentTheme];

  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard & Reminders',
      icon: BellRing,
      badge: totalUrgent > 0 ? totalUrgent : null,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'documents' as TabType,
      label: 'Passports & KITAS Registry',
      icon: FileText,
    },
    {
      id: 'clients' as TabType,
      label: 'Clients & Sponsors',
      icon: Users,
    },
    {
      id: 'services' as TabType,
      label: 'Agency Services Catalog',
      icon: BookOpen,
    },
    {
      id: 'backup' as TabType,
      label: 'Backup & Restore Data',
      icon: Database,
    },
  ];

  const themeOptions: { id: ThemeColor; name: string; colorDot: string }[] = [
    { id: 'blue', name: 'Consultant Blue (Default)', colorDot: 'bg-blue-600' },
    { id: 'emerald', name: 'Emerald Business', colorDot: 'bg-emerald-600' },
    { id: 'indigo', name: 'Royal Indigo Corporate', colorDot: 'bg-indigo-600' },
    { id: 'slate', name: 'Slate Enterprise Minimal', colorDot: 'bg-slate-800' },
  ];

  return (
    <>
      {/* Top Bar for Mobile Screen */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-40 flex items-center justify-between shadow-2xs">
        <div>
          <div className="flex items-center space-x-1.5">
            <h1 className="font-bold text-base text-slate-900 leading-none">A.R.I.S.</h1>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Synergy Success Consultant</p>
        </div>

        <div className="flex items-center space-x-2">
          {totalUrgent > 0 && (
            <button
              onClick={() => {
                setActiveTab('documents');
                setMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{totalUrgent}</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Left Side */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 shadow-xs lg:shadow-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-5 space-y-6 scrollbar-none">
          {/* Header Branding */}
          <div className="space-y-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">
                  A.R.I.S.
                </h1>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  v1.0
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Application Reminding Integrated System
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] text-slate-600 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700">Synergy Success Consultant</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onOpenAddDocument();
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all ${themeAccentBg}`}
            >
              <Plus className="w-4 h-4" />
              <span>Record New Document</span>
            </button>

            <button
              onClick={() => {
                onOpenAddClient();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-slate-600" />
              <span>Add New Client</span>
            </button>
          </div>

          {/* Urgent Warning Box if any */}
          {totalUrgent > 0 && (
            <div 
              onClick={() => {
                setActiveTab('documents');
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl p-3 text-xs space-y-1 transition-colors"
            >
              <div className="flex items-center space-x-1.5 font-bold text-rose-800">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Document Alert!</span>
              </div>
              <p className="text-[11px] text-rose-700 leading-snug">
                There are <strong className="font-bold underline">{totalUrgent} documents</strong> that have expired or need urgent renewal.
              </p>
            </div>
          )}

          {/* Navigation Menu Links */}
          <div className="space-y-1 flex-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 px-2 block mb-2">
              Main Navigation
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                    isActive
                      ? `${activeTabStyle} shadow-2xs`
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? activeIconColor : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme Selector Widget */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                <span>Theme & Color Options</span>
              </div>
              <span className="text-[10px] text-slate-400 capitalize">{currentTheme}</span>
            </button>

            {showThemePicker && (
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs animate-in fade-in duration-150">
                <span className="text-[10px] font-bold text-slate-500 px-2 block">Sidebar Accent Color:</span>
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition-colors ${
                      currentTheme === opt.id ? 'bg-white font-bold text-slate-900 border border-slate-200 shadow-2xs' : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${opt.colorDot}`} />
                      <span>{opt.name}</span>
                    </div>
                    {currentTheme === opt.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}

            {/* System Status */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Auto Reminder Ready
              </span>
              <span className="text-slate-400">Offline Local DB</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
