import React, { useRef } from 'react';
import { Client, ImmigrationDocument } from '../types';
import { Database, Download, Upload, RotateCcw, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';

interface BackupRestoreProps {
  clients: Client[];
  documents: ImmigrationDocument[];
  onImportData: (data: { clients: Client[]; documents: ImmigrationDocument[] }) => void;
  onResetToDefault: () => void;
}

export const BackupRestore: React.FC<BackupRestoreProps> = ({
  clients,
  documents,
  onImportData,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export JSON file
  const handleExport = () => {
    const dataObj = {
      appName: 'A.R.I.S. (Application Reminding Integrated System)',
      exportDate: new Date().toISOString(),
      clients,
      documents,
    };

    const jsonStr = JSON.stringify(dataObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARIS_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.clients || !parsed.documents) {
          throw new Error('Format berkas JSON tidak valid. Membutuhkan data "clients" dan "documents".');
        }

        onImportData({
          clients: parsed.clients,
          documents: parsed.documents,
        });

        alert(`Database A.R.I.S. berhasil dipulihkan! (${parsed.clients.length} Client, ${parsed.documents.length} Dokumen).`);
      } catch (err: any) {
        alert(`Gagal memulihkan berkas backup: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-md shadow-blue-500/10 space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-blue-100 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-blue-200" />
          <span>Pengelolaan Backup & Pemulihan Data A.R.I.S.</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Backup, Import & Reset Database Biro Jasa
        </h2>
        <p className="text-xs text-blue-100 leading-relaxed">
          Amankan seluruh catatan dokumen, data kontak client, dan histori reminder dengan mengunduh salinan berkas JSON atau memulihkannya sewaktu-waktu.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Unduh Salinan Backup (Export JSON)
                </h3>
                <p className="text-xs text-slate-500">
                  Simpan seluruh data ke dalam 1 file JSON di komputer Anda.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Client Terdaftar:</span>
                <strong className="text-slate-900">{clients.length} Record</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Dokumen Paspor/KITAS:</span>
                <strong className="text-slate-900">{documents.length} Record</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all mt-4"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor & Unduh Backup Database (.json)</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 border border-purple-100">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Pulihkan Data dari Berkas Backup (Import)
                </h3>
                <p className="text-xs text-slate-500">
                  Unggah berkas JSON backup A.R.I.S. yang pernah diunduh sebelumnya.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Memulihkan berkas JSON akan memperbarui database lokal dengan data dari file backup tersebut.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Pilih File Backup (.json) & Restore</span>
            </button>
          </div>
        </div>

      </div>

      {/* Reset to Initial Sample Data Card */}
      <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              Reset ke Data Sampel Awal Synergy Biro Jasa
            </h4>
            <p className="text-xs text-slate-600">
              Kembalikan database ke contoh awal dengan data client expat & paspor terdaftar.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke sampel awal? Data perubahan Anda akan ditimpa.')) {
              onResetToDefault();
            }
          }}
          className="px-4 py-2 bg-white hover:bg-rose-600 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all shrink-0 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 inline mr-1.5" />
          <span>Reset Sampel Awal</span>
        </button>
      </div>

    </div>
  );
};
