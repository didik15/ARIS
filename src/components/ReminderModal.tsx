import React, { useState, useEffect } from 'react';
import { ImmigrationDocument, ReminderTemplate } from '../types';
import { getDaysUntilExpiry, formatIndonesianDate } from '../utils/dateUtils';
import { INITIAL_REMINDER_TEMPLATES } from '../data/initialData';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Mail,
  AlertCircle
} from 'lucide-react';

interface ReminderModalProps {
  document: ImmigrationDocument | null;
  onClose: () => void;
  onMarkReminderSent: (docId: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  document,
  onClose,
  onMarkReminderSent,
}) => {
  if (!document) return null;

  const daysLeft = getDaysUntilExpiry(document.expiryDate);
  const formattedExpiry = formatIndonesianDate(document.expiryDate);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-01');
  const [messageText, setMessageText] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>(
    `[Immigration Expiry Notice] ${document.docType} (${document.docNumber}) - ${document.clientName}`
  );
  const [copied, setCopied] = useState(false);
  const [agencyPhone, setAgencyPhone] = useState('0812-3456-7890');

  // Helper to compile template
  const compileTemplate = (templateContent: string) => {
    return templateContent
      .replace(/\{CLIENT_NAME\}/g, document.clientName)
      .replace(/\{DOC_TYPE\}/g, document.docType)
      .replace(/\{DOC_NUMBER\}/g, document.docNumber)
      .replace(/\{EXPIRY_DATE\}/g, formattedExpiry)
      .replace(/\{DAYS_LEFT\}/g, daysLeft < 0 ? `0 (EXPIRED)` : daysLeft.toString())
      .replace(/\{COMPANY_NAME\}/g, document.companyName || document.sponsorName || 'Pribadi')
      .replace(/\{AGENCY_PHONE\}/g, agencyPhone);
  };

  useEffect(() => {
    const tpl = INITIAL_REMINDER_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (tpl) {
      setMessageText(compileTemplate(tpl.content));
    }
  }, [selectedTemplateId, document, agencyPhone]);

  // Handle Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate WhatsApp Direct Link
  const cleanPhone = (phoneStr: string) => {
    let p = phoneStr.replace(/[^0-9]/g, '');
    if (p.startsWith('0')) {
      p = '62' + p.substring(1);
    }
    return p;
  };

  const handleOpenWhatsApp = () => {
    const phoneNo = cleanPhone(document.clientPhone);
    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${phoneNo}?text=${encodedText}`;
    
    // Log reminder sent
    onMarkReminderSent(document.id);
    window.open(waUrl, '_blank');
  };

  // Generate Email Direct Link
  const handleOpenEmail = () => {
    if (!document.clientEmail) {
      alert('Client email address is not recorded for this document.');
      return;
    }
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(messageText);
    const mailtoUrl = `mailto:${document.clientEmail}?subject=${subject}&body=${body}`;

    // Log reminder sent
    onMarkReminderSent(document.id);
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl flex items-center space-x-1">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Send Expiry Reminder — WhatsApp & Email
              </h3>
              <p className="text-xs text-slate-400">
                Client: <strong className="text-white">{document.clientName}</strong> ({document.docType})
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Document & Client Contacts Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Type & Number</span>
              <span className="font-bold text-slate-900 text-sm">{document.docType} ({document.docNumber})</span>
            </div>

            <div>
              <span className="text-slate-500 block">Expiry Date</span>
              <span className="font-semibold text-slate-900">{formattedExpiry}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Remaining Time</span>
              <span className={`font-bold px-2.5 py-1 rounded-md text-xs border ${
                daysLeft < 0
                  ? 'bg-rose-600 text-white border-rose-700 font-black'
                  : daysLeft <= 30
                  ? 'bg-rose-100 text-rose-950 border-rose-300 font-bold'
                  : daysLeft <= 60
                  ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                  : 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold'
              }`}>
                {daysLeft < 0 ? `EXPIRED (${Math.abs(daysLeft)} days ago)` : `${daysLeft} Days Left`}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-slate-500 flex items-center space-x-1">
                <span>WhatsApp:</span>
                <strong className="text-emerald-600 font-bold">{document.clientPhone}</strong>
              </div>
              <div className="text-slate-500 flex items-center space-x-1">
                <span>Email:</span>
                <strong className="text-blue-600 font-bold">{document.clientEmail || 'Not Recorded'}</strong>
              </div>
            </div>
          </div>

          {/* Template Selection Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Select Message Template:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INITIAL_REMINDER_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all ${
                    selectedTemplateId === tpl.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-semibold truncate">{tpl.title}</span>
                  <span className="text-[10px] text-slate-400">Language: {tpl.language}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Email Subject Line (Optional for Email mode) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Email Subject Line:
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              placeholder="Subject for email notification..."
            />
          </div>

          {/* Text Editor Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Preview & Edit Message Content:
              </label>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Last sent: {document.lastReminderDate || 'Never'} ({document.reminderSentCount}x)
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onMarkReminderSent(document.id);
                alert(`Document status for ${document.clientName} updated: Reminder logged as sent!`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Mark as Sent
            </button>

            <button
              onClick={handleOpenEmail}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition-all"
              title={`Send to ${document.clientEmail || 'Email'}`}
            >
              <Mail className="w-4 h-4" />
              <span>Send via Email</span>
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-1.5 transition-all"
              title={`Send to ${document.clientPhone}`}
            >
              <Send className="w-4 h-4" />
              <span>Send via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
