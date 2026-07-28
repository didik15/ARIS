import React, { useState } from 'react';
import { Client, ImmigrationDocument } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Edit3, 
  Trash2, 
  UserCheck,
  ChevronRight,
  Send
} from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  documents: ImmigrationDocument[];
  onOpenAddClient: () => void;
  onOpenEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onOpenAddDocumentForClient: (client: Client) => void;
  onOpenReminderModal: (doc: ImmigrationDocument) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  documents,
  onOpenAddClient,
  onOpenEditClient,
  onDeleteClient,
  onOpenAddDocumentForClient,
  onOpenReminderModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientType, setSelectedClientType] = useState<string>('ALL');
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  const filteredClients = clients.filter(c => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      c.name.toLowerCase().includes(search) ||
      c.nationality.toLowerCase().includes(search) ||
      c.passportNo.toLowerCase().includes(search) ||
      (c.companyName && c.companyName.toLowerCase().includes(search)) ||
      c.phone.includes(search)
    );

    const matchesType = selectedClientType === 'ALL' || c.clientType === selectedClientType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Database Client & Sponsor Perusahaan ({filteredClients.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data kontak client WNA/WNI, nomor WhatsApp, email, dan sponsor PT PMA untuk pengiriman pengingat.
            </p>
          </div>

          <button
            onClick={onOpenAddClient}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Client Baru</span>
          </button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Nama Client, Kebangsaan, PT Sponsor, WA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <select
            value={selectedClientType}
            onChange={(e) => setSelectedClientType(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="ALL">Semua Kategori Client</option>
            <option value="Expat">Expat / WNA</option>
            <option value="Corporate">Corporate / Sponsor PT PMA</option>
            <option value="Individual">Individual / WNI</option>
          </select>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            Tidak ditemukan data client yang cocok dengan filter pencarian.
          </div>
        ) : (
          filteredClients.map((client) => {
            const clientDocs = documents.filter(d => d.clientId === client.id);
            const isExpanded = expandedClientId === client.id;

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="space-y-3">
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-base text-slate-900">
                          {client.name}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                          client.clientType === 'Expat'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : client.clientType === 'Corporate'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {client.clientType}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center space-x-3 mt-1 flex-wrap">
                        <span className="flex items-center">
                          <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {client.nationality}
                        </span>
                        <span>•</span>
                        <span>Paspor: <strong className="text-slate-800">{client.passportNo}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onOpenEditClient(client)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Edit Client"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus data client ${client.name}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors"
                        title="Hapus Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-700 border border-slate-100">
                    {client.companyName && (
                      <div className="flex items-center space-x-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-900">PT / Sponsor: {client.companyName}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>WhatsApp: <strong className="text-emerald-600">{client.phone}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Email: {client.email}</span>
                    </div>

                    {client.notes && (
                      <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                        "{client.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents list toggle */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{clientDocs.length} Dokumen Terdaftar</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    <button
                      onClick={() => onOpenAddDocumentForClient(client)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3 text-blue-500" />
                      <span>Tambah Dokumen</span>
                    </button>
                  </div>

                  {/* Expanded Documents drawer */}
                  {isExpanded && (
                    <div className="space-y-1.5 pt-2">
                      {clientDocs.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Belum ada catatan dokumen keimigrasian untuk client ini.</p>
                      ) : (
                        clientDocs.map((doc) => (
                          <div 
                            key={doc.id}
                            className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between border border-slate-100"
                          >
                            <div>
                              <span className="font-bold text-slate-900">{doc.docType}</span>
                              <span className="text-slate-500 ml-2">({doc.docNumber})</span>
                              <div className="text-[11px] text-slate-500">Expired: {doc.expiryDate}</div>
                            </div>

                            <button
                              onClick={() => onOpenReminderModal(doc)}
                              className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold flex items-center space-x-1 hover:bg-emerald-700 transition-colors shadow-2xs"
                            >
                              <Send className="w-3 h-3" />
                              <span>Reminder</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
