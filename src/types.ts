export type ClientType = 'Corporate' | 'Individual' | 'Expat';

export interface Client {
  id: string;
  name: string;
  nationality: string;
  passportNo: string;
  clientType: ClientType;
  companyName?: string; // PT PMA / Sponsor Name
  phone: string; // WhatsApp number
  email: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export type DocType = 
  | 'Paspor WNI'
  | 'Paspor WNA'
  | 'KITAS Investor'
  | 'KITAS Kerja'
  | 'KITAS Keluarga'
  | 'KITAP'
  | 'VOA / ITK'
  | 'RPTKA / IMTA'
  | 'EPO / ERP'
  | 'SKTT / STM'
  | 'Izin Usaha / NIB'
  | 'Lainnya';

export type DocStatus = 'Active' | 'Renewal_Due' | 'In_Progress' | 'Completed' | 'Expired';

export type ProcessStage = 
  | 'Berkas Belum Diterima'
  | 'Pengumpulan Berkas Client'
  | 'Submit Online / Imigrasi'
  | 'Jadwal Biometrik & Foto'
  | 'Stempel Paspor / Verifikasi'
  | 'Selesai & Diserahkan';

export interface ImmigrationDocument {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  companyName?: string;
  docType: DocType;
  docNumber: string;
  country: string;
  issueDate: string;
  expiryDate: string;
  sponsorName?: string;
  status: DocStatus;
  processStage: ProcessStage;
  notes?: string;
  reminderSentCount: number;
  lastReminderDate?: string;
}

export type ExpiryAlertLevel = 'CRITICAL' | 'WARNING' | 'ATTENTION' | 'SAFE' | 'EXPIRED';

export interface ExpiryAlert {
  level: ExpiryAlertLevel;
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  description: string;
}

export interface AgencyService {
  id: string;
  name: string;
  category: 'Paspor' | 'Izin Tinggal (KITAS/KITAP)' | 'Visa & VOA' | 'Legalitas Perusahaan';
  estimatedDays: string;
  requirements: string[];
  description: string;
  estimatedFeeIndonesian?: string;
}

export interface ReminderTemplate {
  id: string;
  title: string;
  language: 'Indonesia' | 'English' | 'Bilingual';
  content: string;
}
