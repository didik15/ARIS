import React, { useState, useEffect } from 'react';
import { Client, ClientType } from '../types';
import { X, Users, Building, Globe, Phone, Mail, FileText } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'id' | 'createdAt'> & { id?: string }) => void;
  initialClient?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialClient,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNo, setPassportNo] = useState('');
  const [clientType, setClientType] = useState<ClientType>('Expat');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialClient) {
      setName(initialClient.name || '');
      setNationality(initialClient.nationality || '');
      setPassportNo(initialClient.passportNo || '');
      setClientType(initialClient.clientType || 'Expat');
      setCompanyName(initialClient.companyName || '');
      setPhone(initialClient.phone || '');
      setEmail(initialClient.email || '');
      setAddress(initialClient.address || '');
      setNotes(initialClient.notes || '');
    } else {
      setName('');
      setNationality('Indonesia (WNI)');
      setPassportNo('');
      setClientType('Expat');
      setCompanyName('');
      setPhone('628');
      setEmail('');
      setAddress('');
      setNotes('');
    }
  }, [initialClient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Client Name and WhatsApp Number are required.');
      return;
    }

    onSave({
      id: initialClient?.id,
      name,
      nationality: nationality || 'Indonesia',
      passportNo: passportNo || 'N/A',
      clientType,
      companyName,
      phone,
      email,
      address,
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {initialClient ? 'Edit Client Details' : 'Add New Client'}
              </h3>
              <p className="text-xs text-slate-400">
                Contact and sponsor record management for immigration consultancy
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alexander Volkov"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Client Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Client Category *
              </label>
              <select
                value={clientType}
                onChange={(e: any) => setClientType(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              >
                <option value="Expat">Expat / Foreigner</option>
                <option value="Corporate">Corporate / Sponsor Company</option>
                <option value="Individual">Individual / Indonesian</option>
              </select>
            </div>

            {/* Nationality */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nationality
              </label>
              <input
                type="text"
                placeholder="e.g. Russia, Australia, Indonesia"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Passport Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Passport / ID Number
              </label>
              <input
                type="text"
                placeholder="e.g. N7891230 / X182930"
                value={passportNo}
                onChange={(e) => setPassportNo(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-mono"
              />
            </div>

            {/* Company / Sponsor PT */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Company / Sponsor Name
              </label>
              <input
                type="text"
                placeholder="e.g. PT Bali Synergy Investama"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* WhatsApp Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                WhatsApp Number (with Country Code) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 6281234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 font-semibold text-emerald-600"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Address */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Residential / Office Address
              </label>
              <input
                type="text"
                placeholder="e.g. Jl. Sunset Road No. 88, Badung, Bali"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Agency Notes & Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Additional notes, renewal history, special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Buttons */}
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
              Save Client Data
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
