import React, { useState, useMemo } from 'react';
import { ImmigrationDocument, DocType, ExpiryAlertLevel } from '../types';
import { 
  getDaysUntilExpiry, 
  getExpiryAlertLevel, 
  getExpiryAlertConfig, 
  formatIndonesianDate 
} from '../utils/dateUtils';
import { 
  Search, 
  Filter, 
  Plus, 
  Send, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertOctagon, 
  Building, 
  Globe, 
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface DocumentListProps {
  documents: ImmigrationDocument[];
  initialFilterLevel?: string;
  onOpenReminderModal: (doc: ImmigrationDocument) => void;
  onOpenProcessModal: (doc: ImmigrationDocument) => void;
  onOpenEditDocument: (doc: ImmigrationDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onOpenAddDocument: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  initialFilterLevel = 'ALL',
  onOpenReminderModal,
  onOpenProcessModal,
  onOpenEditDocument,
  onDeleteDocument,
  onOpenAddDocument,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocType, setSelectedDocType] = useState<string>('ALL');
  const [selectedAlertLevel, setSelectedAlertLevel] = useState<string>(initialFilterLevel);
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  // Process documents with current dates
  const processedDocs = useMemo(() => {
    return documents.map(doc => {
      const daysLeft = getDaysUntilExpiry(doc.expiryDate);
      const alertLevel = getExpiryAlertLevel(daysLeft);
      return { ...doc, daysLeft, alertLevel };
    });
  }, [documents]);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return processedDocs.filter(d => {
      // Search
      const search = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || (
        d.clientName.toLowerCase().includes(search) ||
        d.docNumber.toLowerCase().includes(search) ||
        d.country.toLowerCase().includes(search) ||
        (d.companyName && d.companyName.toLowerCase().includes(search)) ||
        (d.sponsorName && d.sponsorName.toLowerCase().includes(search))
      );

      // Doc type filter
      const matchesDocType = selectedDocType === 'ALL' || d.docType === selectedDocType;

      // Alert level filter
      const matchesAlertLevel = selectedAlertLevel === 'ALL' || d.alertLevel === selectedAlertLevel;

      // Process stage filter
      const matchesStage = selectedStage === 'ALL' || d.processStage === selectedStage;

      return matchesSearch && matchesDocType && matchesAlertLevel && matchesStage;
    }).sort((a, b) => a.daysLeft - b.daysLeft); // Ascending by days left (closest expiry first)
  }, [processedDocs, searchTerm, selectedDocType, selectedAlertLevel, selectedStage]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Passports, KITAS & Expat Documents ({filteredDocs.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive registry of Indonesian & Foreign Passports, KITAS, KITAP, VOA, and application stages.
            </p>
          </div>

          <button
            onClick={onOpenAddDocument}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Document</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Name, Passport No, Company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Doc Type Dropdown */}
          <select
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="ALL">All Document Types</option>
            <option value="Indonesian Passport">Indonesian Passport</option>
            <option value="Foreigner Passport">Foreigner Passport</option>
            <option value="Investor KITAS">Investor KITAS</option>
            <option value="Working KITAS">Working KITAS</option>
            <option value="Family KITAS">Family KITAS</option>
            <option value="KITAP (Permanent Stay)">KITAP</option>
            <option value="VOA / Tourist ITK">VOA / Tourist ITK</option>
            <option value="Work Permit (RPTKA/IMTA)">RPTKA / IMTA</option>
            <option value="EPO / ERP (Exit Permit)">EPO / ERP</option>
            <option value="Residence Cert (SKTT/STM)">SKTT / STM</option>
          </select>

          {/* Alert Level Dropdown */}
          <select
            value={selectedAlertLevel}
            onChange={(e) => setSelectedAlertLevel(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="ALL">All Urgency Levels</option>
            <option value="EXPIRED">Expired (Overstay Risk)</option>
            <option value="CRITICAL">Urgent (&lt; 30 Days)</option>
            <option value="WARNING">Warning (31-60 Days)</option>
            <option value="ATTENTION">Attention (61-90 Days)</option>
            <option value="SAFE">Valid (&gt; 90 Days)</option>
          </select>

          {/* Process Stage Dropdown */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="ALL">All Process Stages</option>
            <option value="Documents Pending">Documents Pending</option>
            <option value="Client File Collection">Client File Collection</option>
            <option value="Online/Immigration Submission">Online/Immigration Submission</option>
            <option value="Biometrics & Photo Appointment">Biometrics & Photo Appointment</option>
            <option value="Passport Stamping & Verification">Passport Stamping & Verification</option>
            <option value="Completed & Delivered">Completed & Delivered</option>
          </select>
        </div>
      </div>

      {/* Main Documents Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Client Name & Nationality</th>
                <th className="py-3.5 px-4">Type & Document No.</th>
                <th className="py-3.5 px-4">Sponsor / Company</th>
                <th className="py-3.5 px-4">Expiration Date</th>
                <th className="py-3.5 px-4">Reminder Status</th>
                <th className="py-3.5 px-4 text-center">Process Stage</th>
                <th className="py-3.5 px-4 text-right">Actions & Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No document records matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const cfg = getExpiryAlertConfig(doc.alertLevel);
                  return (
                    <tr 
                      key={doc.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Client info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {doc.clientName}
                        </div>
                        <div className="text-slate-500 flex items-center space-x-1 mt-0.5">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{doc.country}</span>
                          <span>•</span>
                          <span>{doc.clientPhone}</span>
                        </div>
                      </td>

                      {/* Doc type & number */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {doc.docType}
                        </div>
                        <div className="font-mono text-[11px] text-blue-600">
                          {doc.docNumber}
                        </div>
                      </td>

                      {/* Sponsor / Company */}
                      <td className="py-3.5 px-4 text-slate-700">
                        {doc.sponsorName || doc.companyName ? (
                          <div className="flex items-center space-x-1">
                            <Building className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{doc.sponsorName || doc.companyName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-italics">Personal</span>
                        )}
                      </td>

                      {/* Expiry Date & Countdown Alert Badge */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">
                          {formatIndonesianDate(doc.expiryDate)}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bgClass} ${cfg.colorClass} ${cfg.borderClass}`}>
                            {doc.daysLeft < 0 ? `EXPIRED (${Math.abs(doc.daysLeft)} days)` : `${doc.daysLeft} Days Left`}
                          </span>
                        </div>
                      </td>

                      {/* Reminder status */}
                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {doc.reminderSentCount > 0 ? (
                          <div>
                            <span className="text-emerald-600 font-semibold">
                              Sent {doc.reminderSentCount}x
                            </span>
                            <div className="text-[10px] text-slate-400">
                              Last: {doc.lastReminderDate}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">Not Sent Yet</span>
                        )}
                      </td>

                      {/* Process Stage */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onOpenProcessModal(doc)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 text-[11px] font-semibold transition-all inline-flex items-center space-x-1"
                          title="Click to change application process stage"
                        >
                          <RefreshCw className="w-3 h-3 text-blue-500" />
                          <span>{doc.processStage}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onOpenReminderModal(doc)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                            title="Send WhatsApp Reminder"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenEditDocument(doc)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit Document"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete document ${doc.docType} (${doc.docNumber}) for ${doc.clientName}?`)) {
                                onDeleteDocument(doc.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
