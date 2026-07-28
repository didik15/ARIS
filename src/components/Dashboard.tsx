import React, { useState } from 'react';
import { ImmigrationDocument, Client } from '../types';
import { 
  getDaysUntilExpiry, 
  getExpiryAlertLevel, 
  getExpiryAlertConfig, 
  formatIndonesianDate 
} from '../utils/dateUtils';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Users, 
  FileText, 
  Send, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Building,
  Calendar
} from 'lucide-react';

interface DashboardProps {
  documents: ImmigrationDocument[];
  clients: Client[];
  onOpenReminderModal: (doc: ImmigrationDocument) => void;
  onOpenProcessModal: (doc: ImmigrationDocument) => void;
  onSelectDocumentTabWithFilter?: (filterLevel: string) => void;
  onOpenAddDocument: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  clients,
  onOpenReminderModal,
  onOpenProcessModal,
  onSelectDocumentTabWithFilter,
  onOpenAddDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');

  // Compute Stats
  const processedDocs = documents.map(doc => {
    const daysLeft = getDaysUntilExpiry(doc.expiryDate);
    const alertLevel = getExpiryAlertLevel(daysLeft);
    return { ...doc, daysLeft, alertLevel };
  });

  const expiredDocs = processedDocs.filter(d => d.alertLevel === 'EXPIRED');
  const criticalDocs = processedDocs.filter(d => d.alertLevel === 'CRITICAL');
  const warningDocs = processedDocs.filter(d => d.alertLevel === 'WARNING');
  const attentionDocs = processedDocs.filter(d => d.alertLevel === 'ATTENTION');
  const safeDocs = processedDocs.filter(d => d.alertLevel === 'SAFE');

  // Stage Stats
  const stageCounts = {
    'Documents Pending': documents.filter(d => d.processStage === 'Documents Pending').length,
    'Client File Collection': documents.filter(d => d.processStage === 'Client File Collection').length,
    'Online/Immigration Submission': documents.filter(d => d.processStage === 'Online/Immigration Submission').length,
    'Biometrics & Photo Appointment': documents.filter(d => d.processStage === 'Biometrics & Photo Appointment').length,
    'Passport Stamping & Verification': documents.filter(d => d.processStage === 'Passport Stamping & Verification').length,
    'Completed & Delivered': documents.filter(d => d.processStage === 'Completed & Delivered').length,
  };

  // Urgent list (< 30 days or expired)
  const urgentList = processedDocs
    .filter(d => d.alertLevel === 'EXPIRED' || d.alertLevel === 'CRITICAL' || d.alertLevel === 'WARNING')
    .filter(d => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        d.clientName.toLowerCase().includes(term) ||
        d.docNumber.toLowerCase().includes(term) ||
        d.docType.toLowerCase().includes(term) ||
        (d.companyName && d.companyName.toLowerCase().includes(term))
      );
    })
    .filter(d => {
      if (docTypeFilter === 'ALL') return true;
      return d.docType === docTypeFilter;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome / Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-md shadow-blue-500/15 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>A.R.I.S. Passport & KITAS Monitoring</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Passport & Visa Expiry Monitoring System
            </h2>
            <p className="text-blue-100 text-xs md:text-sm max-w-2xl leading-relaxed">
              Track client document validity automatically. Prevent overstay issues and send 1-click instant WhatsApp reminders.
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={onOpenAddDocument}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-700 font-bold text-xs shadow-md shadow-black/10 flex items-center justify-center space-x-2 transition-all"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Record New Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {/* Total Client */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Clients</p>
          <div className="mt-1">
            <h3 className="text-2xl font-black text-slate-900">{clients.length}</h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">Sponsor & Personal</p>
          </div>
        </div>

        {/* Expired (< 0 hr) */}
        <button
          onClick={() => onSelectDocumentTabWithFilter && onSelectDocumentTabWithFilter('EXPIRED')}
          className={`p-5 rounded-2xl border shadow-xs text-left transition-all hover:scale-[1.02] ring-2 ring-rose-500/10 ${
            expiredDocs.length > 0
              ? 'bg-rose-50/80 border-rose-200'
              : 'bg-white border-slate-200'
          }`}
        >
          <p className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">Expired</p>
          <div className="mt-1">
            <h3 className="text-2xl font-black text-slate-900">{expiredDocs.length}</h3>
            <p className="text-rose-600 text-xs mt-1 font-semibold">Overstay Risk!</p>
          </div>
        </button>

        {/* Critical (0-30 days) */}
        <button
          onClick={() => onSelectDocumentTabWithFilter && onSelectDocumentTabWithFilter('CRITICAL')}
          className={`p-5 rounded-2xl border shadow-xs text-left transition-all hover:scale-[1.02] ${
            criticalDocs.length > 0
              ? 'bg-red-50/80 border-red-200'
              : 'bg-white border-slate-200'
          }`}
        >
          <p className="text-red-600 text-xs font-bold uppercase tracking-wider mb-1">Urgent (&lt;30 Days)</p>
          <div className="mt-1">
            <h3 className="text-2xl font-black text-slate-900">{criticalDocs.length}</h3>
            <p className="text-red-600 text-xs mt-1 font-semibold">Immediate Action</p>
          </div>
        </button>

        {/* Warning (31-60 days) */}
        <button
          onClick={() => onSelectDocumentTabWithFilter && onSelectDocumentTabWithFilter('WARNING')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left hover:scale-[1.02] transition-all"
        >
          <p className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">Warning (31-60 Days)</p>
          <div className="mt-1">
            <h3 className="text-2xl font-black text-slate-900">{warningDocs.length}</h3>
            <p className="text-amber-600 text-xs mt-1 font-medium">Contact Client</p>
          </div>
        </button>

        {/* Attention (61-90 days) */}
        <button
          onClick={() => onSelectDocumentTabWithFilter && onSelectDocumentTabWithFilter('ATTENTION')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left hover:scale-[1.02] transition-all"
        >
          <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Attention (61-90 Days)</p>
          <div className="mt-1">
            <h3 className="text-2xl font-black text-slate-900">{attentionDocs.length}</h3>
            <p className="text-slate-500 text-xs mt-1 font-medium">Prepare Files</p>
          </div>
        </button>

        {/* Safe (>90 days) */}
        <button
          onClick={() => onSelectDocumentTabWithFilter && onSelectDocumentTabWithFilter('SAFE')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left hover:scale-[1.02] transition-all"
        >
          <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">Valid (&gt;90 Days)</p>
          <div className="mt-1">
            <h3 className="text-2xl font-black text-slate-900">{safeDocs.length}</h3>
            <p className="text-emerald-600 text-xs mt-1 font-medium">Active Compliant</p>
          </div>
        </button>
      </div>

      {/* Main Content Layout: Urgent Documents List & Process Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Urgent Documents Needing Reminder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Expiry Action Required ({urgentList.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Documents expired or due soon (&lt;60 days). Click WhatsApp button to send a reminder.
              </p>
            </div>

            {/* Quick Filters inside Card */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search client, passport, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <select
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="ALL">All Documents</option>
                <option value="Indonesian Passport">Indonesian Passport</option>
                <option value="Foreigner Passport">Foreigner Passport</option>
                <option value="Investor KITAS">Investor KITAS</option>
                <option value="Working KITAS">Working KITAS</option>
                <option value="VOA / Tourist ITK">VOA / Tourist ITK</option>
                <option value="KITAP (Permanent Stay)">KITAP</option>
              </select>
            </div>
          </div>

          {/* Table / List View */}
          <div className="divide-y divide-slate-100 overflow-x-auto max-h-[500px] overflow-y-auto">
            {urgentList.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-sm">No critical or urgent document expirations found.</p>
                <p className="text-xs text-slate-400 mt-1">All documents are in valid status or do not match current filter.</p>
              </div>
            ) : (
              urgentList.map((doc) => {
                const cfg = getExpiryAlertConfig(doc.alertLevel);
                return (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {doc.clientName}
                        </span>
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${cfg.bgClass} ${cfg.colorClass} ${cfg.borderClass}`}>
                          {doc.daysLeft < 0 ? `EXPIRED (${Math.abs(doc.daysLeft)} Days Ago)` : `${doc.daysLeft} Days Left`}
                        </span>
                        <span className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md">
                          {doc.docType}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-slate-500 flex-wrap">
                        <span>No: <strong className="text-slate-800">{doc.docNumber}</strong></span>
                        <span>•</span>
                        <span>Expired: <strong className="text-slate-800">{formatIndonesianDate(doc.expiryDate)}</strong></span>
                        {doc.companyName && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <Building className="w-3 h-3 mr-1 text-slate-400" />
                              {doc.companyName}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-1 text-[11px]">
                        <span className="text-slate-400">Process Stage:</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-medium rounded">
                          {doc.processStage}
                        </span>
                        {doc.reminderSentCount > 0 && (
                          <span className="text-emerald-600 flex items-center">
                            • Reminder sent {doc.reminderSentCount}x ({doc.lastReminderDate})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => onOpenProcessModal(doc)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
                        title="Update Immigration Process Stage"
                      >
                        Process Stage
                      </button>

                      <button
                        onClick={() => onOpenReminderModal(doc)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send WA Reminder</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1 col): Process Pipeline Stage Breakdown & Quick Agency Info */}
        <div className="space-y-6">
          {/* Status Pipeline Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Active Application Pipeline
            </h3>

            <div className="space-y-2.5">
              {Object.entries(stageCounts).map(([stageName, count]) => (
                <div 
                  key={stageName}
                  className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100"
                >
                  <span className="text-xs font-medium text-slate-700">
                    {stageName}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {count} files
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Synergy Success Consultant & A.R.I.S. Agency Tips Card */}
          <div className="bg-blue-50/80 rounded-2xl p-5 border border-blue-200/80 text-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Immigration Rules & Tips</span>
            </div>

            <h4 className="font-bold text-sm text-slate-900">
              Key Passport & KITAS Regulations
            </h4>

            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-slate-800">Passport Validity:</strong> Minimum 6 months validity required for international entry/exit.
              </li>
              <li>
                <strong className="text-slate-800">Overstay Fines:</strong> Official immigration penalty is IDR 1,000,000 / day for overstay.
              </li>
              <li>
                <strong className="text-slate-800">Investor KITAS:</strong> Recommended to initiate renewal 30-45 days before expiry.
              </li>
            </ul>
          </div>

          {/* Reminder Queue Panel (Professional Polish Light Theme) */}
          <div className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">Reminder Activity Log</h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold uppercase">
                Active System
              </span>
            </div>
            <div className="space-y-3.5">
              <div className="border-l-2 border-blue-600 pl-4 py-1">
                <p className="text-[10px] text-blue-600 font-bold uppercase">Today, 09:00 WIB</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Automated WA reminder prepared for <span className="font-bold text-slate-900 italic">Hans Schmidt</span>.
                </p>
              </div>
              <div className="border-l-2 border-slate-300 pl-4 py-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Today, 08:30 WIB</p>
                <p className="text-xs text-slate-600 mt-0.5">
                  System Audit: <span className="font-bold text-slate-800">{urgentList.length} files</span> require active follow-up.
                </p>
              </div>
            </div>
            <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 mt-auto">
              <p className="text-[10px] text-blue-800 font-bold uppercase">A.R.I.S. AUTOMATION ACTIVE</p>
              <p className="text-xs text-slate-600 mt-0.5">
                Integrated reminder messaging templates for Synergy Success Consultant client updates.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
