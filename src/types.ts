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
  | 'Indonesian Passport'
  | 'Foreigner Passport'
  | 'Investor KITAS'
  | 'Working KITAS'
  | 'Family KITAS'
  | 'KITAP (Permanent Stay)'
  | 'VOA / Tourist ITK'
  | 'Work Permit (RPTKA/IMTA)'
  | 'EPO / ERP (Exit Permit)'
  | 'Residence Cert (SKTT/STM)'
  | 'Business License / NIB'
  | 'Other';

export type DocStatus = 'Active' | 'Renewal_Due' | 'In_Progress' | 'Completed' | 'Expired';

export type ProcessStage = 
  | 'Documents Pending'
  | 'Client File Collection'
  | 'Online/Immigration Submission'
  | 'Biometrics & Photo Appointment'
  | 'Passport Stamping & Verification'
  | 'Completed & Delivered';

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
  category: 'Passports' | 'Residence Permits (KITAS/KITAP)' | 'Visas & VOA' | 'Corporate Legality';
  estimatedDays: string;
  requirements: string[];
  description: string;
  estimatedFeeIndonesian?: string;
}

export interface ReminderTemplate {
  id: string;
  title: string;
  language: 'English' | 'Bilingual' | 'Indonesian';
  content: string;
}
