import React, { useState, useEffect } from 'react';
import { ImmigrationDocument, ProcessStage } from '../types';
import { X, CheckCircle, Clock, RefreshCw, ChevronRight } from 'lucide-react';

interface ProcessModalProps {
  document: ImmigrationDocument | null;
  onClose: () => void;
  onUpdateStage: (docId: string, newStage: ProcessStage, notes?: string) => void;
}

const ALL_STAGES: ProcessStage[] = [
  'Documents Pending',
  'Client File Collection',
  'Online/Immigration Submission',
  'Biometrics & Photo Appointment',
  'Passport Stamping & Verification',
  'Completed & Delivered',
];

export const ProcessModal: React.FC<ProcessModalProps> = ({
  document,
  onClose,
  onUpdateStage,
}) => {
  if (!document) return null;

  const [currentStage, setCurrentStage] = useState<ProcessStage>(document.processStage);
  const [notes, setNotes] = useState<string>(document.notes || '');

  useEffect(() => {
    if (document) {
      setCurrentStage(document.processStage);
      setNotes(document.notes || '');
    }
  }, [document]);

  const handleSave = () => {
    onUpdateStage(document.id, currentStage, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Immigration Application Process Stage
              </h3>
              <p className="text-xs text-slate-400">
                {document.clientName} — {document.docType} ({document.docNumber})
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

        {/* Stages Timeline */}
        <div className="p-6 space-y-5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Select Current Process Stage:
          </label>

          <div className="space-y-2">
            {ALL_STAGES.map((stg, idx) => {
              const isSelected = currentStage === stg;
              return (
                <button
                  key={stg}
                  onClick={() => setCurrentStage(stg)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-900 dark:text-blue-100 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{stg}</span>
                  </div>

                  {isSelected && <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Process Progress Notes:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes on current application stage..."
              className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
          >
            Update Stage
          </button>
        </div>

      </div>
    </div>
  );
};
