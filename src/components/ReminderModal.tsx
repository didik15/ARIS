import React, { useState, useEffect } from 'react';
import { ImmigrationDocument, ReminderTemplate } from '../types';
import { getDaysUntilExpiry, formatIndonesianDate } from '../utils/dateUtils';
import { INITIAL_REMINDER_TEMPLATES } from '../data/initialData';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  FileText, 
  MessageSquare, 
  Smartphone,
  CheckCircle2,
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
  const [copied, setCopied] = useState(false);
  const [agencyPhone, setAgencyPhone] = useState('0812-3456-7890');
  
  // AI Custom generation state
  const [aiLanguage, setAiLanguage] = useState<'Indonesia' | 'English' | 'Japanese' | 'Mandarin'>('Indonesia');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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

  // AI Generation Handler using Express backend
  const handleGenerateAiReminder = async () => {
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/generate-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: document.clientName,
          docType: document.docType,
          docNumber: document.docNumber,
          expiryDate: formattedExpiry,
          daysLeft: daysLeft,
          language: aiLanguage,
          channel: 'WhatsApp',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghasilkan teks AI');
      }

      if (data.reminderText) {
        setMessageText(data.reminderText);
      }
    } catch (err: any) {
      setAiError(err.message || 'Error AI API');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Send Expiry Reminder — A.R.I.S.
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
          
          {/* Document Summary Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Type & Document Number</span>
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

            <div>
              <span className="text-slate-500 block">Client WhatsApp Number</span>
              <span className="font-bold text-emerald-600">{document.clientPhone}</span>
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

          {/* AI Generator Option */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-3.5 rounded-xl border border-purple-200 dark:border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">
                Draft Message Automatically with Gemini AI
              </span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={aiLanguage}
                onChange={(e: any) => setAiLanguage(e.target.value)}
                className="py-1 px-2 text-xs bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="English">English</option>
                <option value="Indonesia">Indonesian</option>
                <option value="Japanese">Japanese</option>
                <option value="Mandarin">Mandarin</option>
              </select>

              <button
                onClick={handleGenerateAiReminder}
                disabled={isGeneratingAi}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center space-x-1 whitespace-nowrap disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingAi ? 'Drafting...' : 'Generate AI'}</span>
              </button>
            </div>
          </div>

          {aiError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

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

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onMarkReminderSent(document.id);
                alert(`Document status for ${document.clientName} updated: Reminder logged as sent!`);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Mark as Sent
            </button>

            <button
              onClick={handleOpenWhatsApp}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all w-full sm:w-auto"
            >
              <Send className="w-4 h-4" />
              <span>Open & Send via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
