import React, { useState, useEffect } from 'react';
import { ImmigrationDocument, Client, DocType, ProcessStage, DocStatus } from '../types';
import { X, FileText, Calendar, Building, Globe, Clock, Plus } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (docData: Omit<ImmigrationDocument, 'id' | 'reminderSentCount'> & { id?: string }) => void;
  clients: Client[];
  initialDocument?: ImmigrationDocument | null;
  preselectedClient?: Client | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clients,
  initialDocument,
  preselectedClient,
}) => {
  if (!isOpen) return null;

  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [docType, setDocType] = useState<DocType>('KITAS Investor');
  const [docNumber, setDocNumber] = useState('');
  const [country, setCountry] = useState('Indonesia');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [status, setStatus] = useState<DocStatus>('Active');
  const [processStage, setProcessStage] = useState<ProcessStage>('Pengumpulan Berkas Client');
  const [notes, setNotes] = useState('');

  // Sync state on load
  useEffect(() => {
    if (initialDocument) {
      setSelectedClientId(initialDocument.clientId || '');
      setDocType(initialDocument.docType || 'KITAS Investor');
      setDocNumber(initialDocument.docNumber || '');
      setCountry(initialDocument.country || '');
      setIssueDate(initialDocument.issueDate || '');
      setExpiryDate(initialDocument.expiryDate || '');
      setSponsorName(initialDocument.sponsorName || '');
      setStatus(initialDocument.status || 'Active');
      setProcessStage(initialDocument.processStage || 'Pengumpulan Berkas Client');
      setNotes(initialDocument.notes || '');
    } else {
      const client = preselectedClient || (clients.length > 0 ? clients[0] : null);
      if (client) {
        setSelectedClientId(client.id);
        setCountry(client.nationality || 'Indonesia');
        setSponsorName(client.companyName || '');
      }
      setDocType('KITAS Investor');
      setDocNumber('');
      const today = new Date().toISOString().split('T')[0];
      setIssueDate(today);

      // Default +1 year for KITAS
      const oneYear = new Date();
      oneYear.setFullYear(oneYear.getFullYear() + 1);
      setExpiryDate(oneYear.toISOString().split('T')[0]);

      setStatus('Active');
      setProcessStage('Pengumpulan Berkas Client');
      setNotes('');
    }
  }, [initialDocument, preselectedClient, isOpen, clients]);

  // Handle client select change
  const handleClientSelect = (cId: string) => {
    setSelectedClientId(cId);
    const c = clients.find(item => item.id === cId);
    if (c) {
      setCountry(c.nationality || 'Indonesia');
      setSponsorName(c.companyName || '');
    }
  };

  // Preset Date Adders
  const addDaysToExpiry = (daysToAdd: number) => {
    const base = issueDate ? new Date(issueDate) : new Date();
    base.setDate(base.getDate() + daysToAdd);
    setExpiryDate(base.toISOString().split('T')[0]);
  };

  const addYearsToExpiry = (yearsToAdd: number) => {
    const base = issueDate ? new Date(issueDate) : new Date();
    base.setFullYear(base.getFullYear() + yearsToAdd);
    setExpiryDate(base.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert('Please select a client first.');
      return;
    }
    if (!docNumber || !expiryDate) {
      alert('Document Number and Expiry Date are required.');
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClientId);
    if (!clientObj) return;

    onSave({
      id: initialDocument?.id,
      clientId: clientObj.id,
      clientName: clientObj.name,
      clientPhone: clientObj.phone,
      clientEmail: clientObj.email,
      companyName: clientObj.companyName,
      docType,
      docNumber,
      country: country || clientObj.nationality || 'Indonesia',
      issueDate: issueDate || new Date().toISOString().split('T')[0],
      expiryDate,
      sponsorName: sponsorName || clientObj.companyName || 'Personal',
      status,
      processStage,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {initialDocument ? 'Edit Immigration Document' : 'Record New Immigration Document'}
              </h3>
              <p className="text-xs text-slate-400">
                A.R.I.S. System — Expiry & Process Stage Tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Select Client */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Client *
            </label>
            <select
              required
              value={selectedClientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
            >
              <option value="">-- Select Registered Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nationality} — {c.companyName || 'Personal'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Doc Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Immigration Document Type *
              </label>
              <select
                value={docType}
                onChange={(e: any) => setDocType(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="Indonesian Passport">Indonesian Passport</option>
                <option value="Foreigner Passport">Foreigner Passport</option>
                <option value="Investor KITAS">Investor KITAS (PMA)</option>
                <option value="Working KITAS">Working KITAS (Expat)</option>
                <option value="Family KITAS">Family KITAS (Spouse/Dependent)</option>
                <option value="KITAP (Permanent Stay)">KITAP (5-Year Permanent Stay)</option>
                <option value="VOA / Tourist ITK">VOA / Tourist ITK (Visa On Arrival)</option>
                <option value="Work Permit (RPTKA/IMTA)">Work Permit (RPTKA/IMTA)</option>
                <option value="EPO / ERP (Exit Permit)">EPO / ERP (Exit Permit)</option>
                <option value="Residence Cert (SKTT/STM)">Residence Cert (SKTT/STM)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Document Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Document Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2C12EF8901-M / X1829402"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Document Country / Nationality
              </label>
              <input
                type="text"
                placeholder="e.g. Indonesia, Russia, Australia"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Sponsor Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sponsor / Responsible Entity
              </label>
              <input
                type="text"
                placeholder="e.g. PT Bali Synergy Investama"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Expiry Date *
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-bold text-red-600 dark:text-red-400"
              />
            </div>

            {/* Date Presets Quick Bar */}
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Quick Expiry Date Calculator:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => addDaysToExpiry(30)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  +30 Days (VOA)
                </button>
                <button
                  type="button"
                  onClick={() => addYearsToExpiry(1)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  +1 Year (KITAS Work)
                </button>
                <button
                  type="button"
                  onClick={() => addYearsToExpiry(2)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  +2 Years (KITAS Investor)
                </button>
                <button
                  type="button"
                  onClick={() => addYearsToExpiry(5)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  +5 Years (KITAP)
                </button>
                <button
                  type="button"
                  onClick={() => addYearsToExpiry(10)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  +10 Years (Indonesian Passport)
                </button>
              </div>
            </div>

            {/* Process Stage */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current Application Process Stage
              </label>
              <select
                value={processStage}
                onChange={(e: any) => setProcessStage(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold"
              >
                <option value="Documents Pending">1. Documents Pending</option>
                <option value="Client File Collection">2. Client File Collection</option>
                <option value="Online/Immigration Submission">3. Online/Immigration Submission</option>
                <option value="Biometrics & Photo Appointment">4. Biometrics & Photo Appointment</option>
                <option value="Passport Stamping & Verification">5. Passport Stamping & Verification</option>
                <option value="Completed & Delivered">6. Completed & Delivered</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Specific Document Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Awaiting LKPM for PMA, or biometrics appointment date at Immigration Office..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              Save Document Record
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
