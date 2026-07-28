import React, { useState, useEffect } from 'react';
import { Client, ImmigrationDocument, ProcessStage } from './types';
import { INITIAL_CLIENTS, INITIAL_DOCUMENTS, INITIAL_SERVICES } from './data/initialData';
import { getDaysUntilExpiry, getExpiryAlertLevel } from './utils/dateUtils';

// Components
import { Sidebar, TabType, ThemeColor } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DocumentList } from './components/DocumentList';
import { ClientList } from './components/ClientList';
import { ServicesCatalog } from './components/ServicesCatalog';
import { BackupRestore } from './components/BackupRestore';

// Modals
import { ClientModal } from './components/ClientModal';
import { DocumentModal } from './components/DocumentModal';
import { ReminderModal } from './components/ReminderModal';
import { ProcessModal } from './components/ProcessModal';

export default function App() {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>('blue');
  const [initialFilterLevel, setInitialFilterLevel] = useState<string>('ALL');

  // LocalStorage State
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('ARIS_CLIENTS_V1');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [documents, setDocuments] = useState<ImmigrationDocument[]>(() => {
    try {
      const saved = localStorage.getItem('ARIS_DOCUMENTS_V1');
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('ARIS_CLIENTS_V1', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ARIS_DOCUMENTS_V1', JSON.stringify(documents));
  }, [documents]);

  // Compute urgent counts for Header badge
  const { criticalCount, expiredCount, warningCount } = documents.reduce(
    (acc, doc) => {
      const daysLeft = getDaysUntilExpiry(doc.expiryDate);
      const level = getExpiryAlertLevel(daysLeft);
      if (level === 'EXPIRED') acc.expiredCount++;
      if (level === 'CRITICAL') acc.criticalCount++;
      if (level === 'WARNING') acc.warningCount++;
      return acc;
    },
    { criticalCount: 0, expiredCount: 0, warningCount: 0 }
  );

  // Modal Control States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ImmigrationDocument | null>(null);
  const [preselectedClientForDoc, setPreselectedClientForDoc] = useState<Client | null>(null);

  const [reminderDoc, setReminderDoc] = useState<ImmigrationDocument | null>(null);
  const [processDoc, setProcessDoc] = useState<ImmigrationDocument | null>(null);

  // Client Handlers
  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => {
    if (clientData.id) {
      // Edit existing
      setClients(prev => prev.map(c => c.id === clientData.id ? { ...c, ...clientData } as Client : c));
    } else {
      // New Client
      const newClient: Client = {
        ...clientData,
        id: `cli-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setClients(prev => [newClient, ...prev]);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    // Also remove client documents
    setDocuments(prev => prev.filter(d => d.clientId !== clientId));
  };

  // Document Handlers
  const handleSaveDocument = (docData: Omit<ImmigrationDocument, 'id' | 'reminderSentCount'> & { id?: string }) => {
    if (docData.id) {
      // Edit existing
      setDocuments(prev => prev.map(d => d.id === docData.id ? { ...d, ...docData } as ImmigrationDocument : d));
    } else {
      // New Document
      const newDoc: ImmigrationDocument = {
        ...docData,
        id: `doc-${Date.now()}`,
        reminderSentCount: 0,
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleMarkReminderSent = (docId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          reminderSentCount: d.reminderSentCount + 1,
          lastReminderDate: today,
        };
      }
      return d;
    }));
  };

  const handleUpdateProcessStage = (docId: string, newStage: ProcessStage, notes?: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          processStage: newStage,
          notes: notes !== undefined ? notes : d.notes,
        };
      }
      return d;
    }));
  };

  // Backup / Restore Handlers
  const handleImportData = (data: { clients: Client[]; documents: ImmigrationDocument[] }) => {
    setClients(data.clients);
    setDocuments(data.documents);
  };

  const handleResetToDefault = () => {
    setClients(INITIAL_CLIENTS);
    setDocuments(INITIAL_DOCUMENTS);
    localStorage.removeItem('ARIS_CLIENTS_V1');
    localStorage.removeItem('ARIS_DOCUMENTS_V1');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col lg:flex-row">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalCount={criticalCount}
        expiredCount={expiredCount}
        warningCount={warningCount}
        onOpenAddClient={() => {
          setEditingClient(null);
          setIsClientModalOpen(true);
        }}
        onOpenAddDocument={() => {
          setEditingDoc(null);
          setPreselectedClientForDoc(null);
          setIsDocModalOpen(true);
        }}
        currentTheme={currentTheme}
        setTheme={setCurrentTheme}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              documents={documents}
              clients={clients}
              onOpenReminderModal={(doc) => setReminderDoc(doc)}
              onOpenProcessModal={(doc) => setProcessDoc(doc)}
              onSelectDocumentTabWithFilter={(filterLevel) => {
                setInitialFilterLevel(filterLevel);
                setActiveTab('documents');
              }}
              onOpenAddDocument={() => {
                setEditingDoc(null);
                setPreselectedClientForDoc(null);
                setIsDocModalOpen(true);
              }}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentList
              documents={documents}
              initialFilterLevel={initialFilterLevel}
              onOpenReminderModal={(doc) => setReminderDoc(doc)}
              onOpenProcessModal={(doc) => setProcessDoc(doc)}
              onOpenEditDocument={(doc) => {
                setEditingDoc(doc);
                setIsDocModalOpen(true);
              }}
              onDeleteDocument={handleDeleteDocument}
              onOpenAddDocument={() => {
                setEditingDoc(null);
                setPreselectedClientForDoc(null);
                setIsDocModalOpen(true);
              }}
            />
          )}

          {activeTab === 'clients' && (
            <ClientList
              clients={clients}
              documents={documents}
              onOpenAddClient={() => {
                setEditingClient(null);
                setIsClientModalOpen(true);
              }}
              onOpenEditClient={(client) => {
                setEditingClient(client);
                setIsClientModalOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onOpenAddDocumentForClient={(client) => {
                setEditingDoc(null);
                setPreselectedClientForDoc(client);
                setIsDocModalOpen(true);
              }}
              onOpenReminderModal={(doc) => setReminderDoc(doc)}
            />
          )}

          {activeTab === 'services' && (
            <ServicesCatalog services={INITIAL_SERVICES} />
          )}

          {activeTab === 'backup' && (
            <BackupRestore
              clients={clients}
              documents={documents}
              onImportData={handleImportData}
              onResetToDefault={handleResetToDefault}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white text-slate-600 py-5 border-t border-slate-200 text-xs text-center shadow-2xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong className="text-slate-900 font-bold">A.R.I.S.</strong> (Application Reminding Integrated System) &copy; 2026 — Synergy Success Consultant
            </div>
            <div className="text-slate-500">
              Sistem Pencatatan & Pengingat Otomatis Paspor WNI/WNA, KITAS, KITAP & Dokumen Keimigrasian
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleSaveClient}
        initialClient={editingClient}
      />

      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSave={handleSaveDocument}
        clients={clients}
        initialDocument={editingDoc}
        preselectedClient={preselectedClientForDoc}
      />

      <ReminderModal
        document={reminderDoc}
        onClose={() => setReminderDoc(null)}
        onMarkReminderSent={handleMarkReminderSent}
      />

      <ProcessModal
        document={processDoc}
        onClose={() => setProcessDoc(null)}
        onUpdateStage={handleUpdateProcessStage}
      />
    </div>
  );
}

