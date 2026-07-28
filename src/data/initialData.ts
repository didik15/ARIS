import { Client, ImmigrationDocument, AgencyService, ReminderTemplate } from '../types';
import { getDateDaysFromNow } from '../utils/dateUtils';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Alexander Volkov',
    nationality: 'Russia',
    passportNo: '75N982412',
    clientType: 'Expat',
    companyName: 'PT Bali Digital Investama',
    phone: '6281234567890',
    email: 'a.volkov@balidigital.id',
    address: 'Sunset Road No. 88, Seminyak, Bali',
    notes: '2-Year Investor KITAS holder. Requires extension offer and status conversion.',
    createdAt: '2025-01-15',
  },
  {
    id: 'cli-002',
    name: 'Samantha Jane Miller',
    nationality: 'Australia',
    passportNo: 'N2948123',
    clientType: 'Expat',
    companyName: 'PT Synergy Utama Global',
    phone: '6281987654321',
    email: 'samantha.miller@gmail.com',
    address: 'Raya Canggu No. 12, Badung, Bali',
    notes: 'Working KITAS holder (Chief Operating Officer).',
    createdAt: '2025-02-10',
  },
  {
    id: 'cli-003',
    name: 'Kenji Takahashi',
    nationality: 'Japan',
    passportNo: 'TK902814',
    clientType: 'Corporate',
    companyName: 'PT Nusantara Manufacturing Tech',
    phone: '6282111223344',
    email: 'takahashi@nusantaratech.co.id',
    address: 'MM2100 Industrial Town, Cikarang, West Java',
    notes: 'In-charge for Japanese expatriates in Jakarta/Cikarang branch.',
    createdAt: '2024-11-01',
  },
  {
    id: 'cli-004',
    name: 'Budi Santoso',
    nationality: 'Indonesia',
    passportNo: 'X1829402',
    clientType: 'Individual',
    companyName: 'Personal',
    phone: '6285678901234',
    email: 'budi.santoso@yahoo.com',
    address: 'Wijaya St. No. 45, Kebayoran Baru, South Jakarta',
    notes: '10-Year Indonesian Passport renewal for business trips to Singapore.',
    createdAt: '2025-03-01',
  },
  {
    id: 'cli-005',
    name: 'Maria Carmen Garcia',
    nationality: 'Spain',
    passportNo: 'ESP782910',
    clientType: 'Expat',
    companyName: 'PT Synergy Resort & Hospitality',
    phone: '6281333444555',
    email: 'maria.garcia@synergyresort.com',
    address: 'Ubud Kayu Manis No. 5, Gianyar, Bali',
    notes: 'Needs VOA extension & Family KITAS application.',
    createdAt: '2025-03-20',
  },
  {
    id: 'cli-006',
    name: 'David Chen',
    nationality: 'Singapore',
    passportNo: 'K8920192',
    clientType: 'Corporate',
    companyName: 'PT Chen Global Ventures',
    phone: '6591234567',
    email: 'david@chenglobal.sg',
    address: 'SCBD District 8, Treasury Tower, South Jakarta',
    notes: 'PMA Investor & Chief Commissioner.',
    createdAt: '2024-08-12',
  },
];

export const INITIAL_DOCUMENTS: ImmigrationDocument[] = [
  {
    id: 'doc-001',
    clientId: 'cli-001',
    clientName: 'Alexander Volkov',
    clientPhone: '6281234567890',
    clientEmail: 'a.volkov@balidigital.id',
    companyName: 'PT Bali Digital Investama',
    docType: 'Investor KITAS',
    docNumber: '2C12EF8901-M',
    country: 'Russia',
    issueDate: '2024-08-01',
    expiryDate: getDateDaysFromNow(12), // 12 days left (CRITICAL alert)
    sponsorName: 'PT Bali Digital Investama',
    status: 'Renewal_Due',
    processStage: 'Client File Collection',
    notes: 'Client informed that KITAS expires in 12 days. Awaiting investment report (LKPM).',
    reminderSentCount: 2,
    lastReminderDate: getDateDaysFromNow(-3),
  },
  {
    id: 'doc-002',
    clientId: 'cli-001',
    clientName: 'Alexander Volkov',
    clientPhone: '6281234567890',
    clientEmail: 'a.volkov@balidigital.id',
    companyName: 'PT Bali Digital Investama',
    docType: 'Foreigner Passport',
    docNumber: '75N982412',
    country: 'Russia',
    issueDate: '2016-09-10',
    expiryDate: getDateDaysFromNow(48), // 48 days left (WARNING alert)
    sponsorName: 'Personal',
    status: 'Active',
    processStage: 'Documents Pending',
    notes: 'Passport validity < 6 months. Needs Embassy renewal before KITAS submission.',
    reminderSentCount: 1,
    lastReminderDate: getDateDaysFromNow(-7),
  },
  {
    id: 'doc-003',
    clientId: 'cli-002',
    clientName: 'Samantha Jane Miller',
    clientPhone: '6281987654321',
    clientEmail: 'samantha.miller@gmail.com',
    companyName: 'PT Synergy Utama Global',
    docType: 'Working KITAS',
    docNumber: '2C11AB3412-K',
    country: 'Australia',
    issueDate: '2024-09-01',
    expiryDate: getDateDaysFromNow(-4), // Expired 4 days ago! (EXPIRED alert)
    sponsorName: 'PT Synergy Utama Global',
    status: 'Expired',
    processStage: 'Online/Immigration Submission',
    notes: 'Urgent: Overstay by 4 days! Overstay fines apply or special permit processing required.',
    reminderSentCount: 4,
    lastReminderDate: getDateDaysFromNow(-1),
  },
  {
    id: 'doc-004',
    clientId: 'cli-003',
    clientName: 'Kenji Takahashi',
    clientPhone: '6282111223344',
    clientEmail: 'takahashi@nusantaratech.co.id',
    companyName: 'PT Nusantara Manufacturing Tech',
    docType: 'KITAP (Permanent Stay)',
    docNumber: '5C10ZZ9912-P',
    country: 'Japan',
    issueDate: '2021-09-20',
    expiryDate: getDateDaysFromNow(75), // 75 days left (ATTENTION alert)
    sponsorName: 'PT Nusantara Manufacturing Tech',
    status: 'Active',
    processStage: 'Documents Pending',
    notes: '5-Year KITAP renewal / MERP. Schedule contact with Corporate HR next month.',
    reminderSentCount: 0,
  },
  {
    id: 'doc-005',
    clientId: 'cli-004',
    clientName: 'Budi Santoso',
    clientPhone: '6285678901234',
    clientEmail: 'budi.santoso@yahoo.com',
    companyName: 'Personal',
    docType: 'Indonesian Passport',
    docNumber: 'X1829402',
    country: 'Indonesia',
    issueDate: '2020-04-10',
    expiryDate: getDateDaysFromNow(22), // 22 days left (CRITICAL alert)
    sponsorName: 'Personal',
    status: 'In_Progress',
    processStage: 'Biometrics & Photo Appointment',
    notes: 'Registered on M-Paspor app. Photo appointment at South Jakarta Immigration Office on Thursday.',
    reminderSentCount: 1,
    lastReminderDate: getDateDaysFromNow(-2),
  },
  {
    id: 'doc-006',
    clientId: 'cli-005',
    clientName: 'Maria Carmen Garcia',
    clientPhone: '6281333444555',
    clientEmail: 'maria.garcia@synergyresort.com',
    companyName: 'PT Synergy Resort & Hospitality',
    docType: 'VOA / Tourist ITK',
    docNumber: 'VOA-88291029',
    country: 'Spain',
    issueDate: '2025-03-01',
    expiryDate: getDateDaysFromNow(8), // 8 days left (CRITICAL alert)
    sponsorName: 'PT Synergy Resort & Hospitality',
    status: 'Renewal_Due',
    processStage: 'Online/Immigration Submission',
    notes: 'Second 30-day VOA Extension at Denpasar Immigration Office.',
    reminderSentCount: 2,
    lastReminderDate: getDateDaysFromNow(-1),
  },
  {
    id: 'doc-007',
    clientId: 'cli-006',
    clientName: 'David Chen',
    clientPhone: '6591234567',
    clientEmail: 'david@chenglobal.sg',
    companyName: 'PT Chen Global Ventures',
    docType: 'Investor KITAS',
    docNumber: '2C15FF1122-M',
    country: 'Singapore',
    issueDate: '2024-11-15',
    expiryDate: getDateDaysFromNow(240), // 240 days left (SAFE alert)
    sponsorName: 'PT Chen Global Ventures',
    status: 'Active',
    processStage: 'Completed & Delivered',
    notes: 'New 2-Year Investor KITAS issued in November.',
    reminderSentCount: 0,
  },
];

export const INITIAL_SERVICES: AgencyService[] = [
  {
    id: 'srv-001',
    name: 'Indonesian Passport Processing (Ordinary / E-Passport)',
    category: 'Passports',
    estimatedDays: '1 - 3 Working Days',
    requirements: ['National ID (KTP)', 'Family Card (KK)', 'Birth Cert / Marriage Cert / Diploma', 'Previous Passport (if renewal)'],
    description: 'Assistance & priority appointment for M-Paspor, biometric photo, and passport collection.',
    estimatedFeeIndonesian: 'IDR 650,000 - IDR 1,500,000 (Express option available)',
  },
  {
    id: 'srv-002',
    name: 'Investor KITAS (PMA Foreign Investment 1 - 2 Years)',
    category: 'Residence Permits (KITAS/KITAP)',
    estimatedDays: '7 - 14 Working Days',
    requirements: ['Valid Foreign Passport > 18 months', 'NIB & Business License of PT PMA', 'Deed of Establishment & Ministry Approval', 'Shareholding min. IDR 10 Billion / PMA rules'],
    description: 'Temporary residence permit for investors and directors of PT PMA companies in Indonesia.',
    estimatedFeeIndonesian: 'IDR 12,000,000 - IDR 18,000,000',
  },
  {
    id: 'srv-003',
    name: 'Working KITAS (Foreign Worker / Expat Employee)',
    category: 'Residence Permits (KITAS/KITAP)',
    estimatedDays: '10 - 20 Working Days',
    requirements: ['Foreign Passport', 'Approved RPTKA Work Permit from Ministry of Manpower', 'DKP-TKA Skill Levy ($1,200/year)', 'University Degree & Experience Certificate', 'Health Insurance'],
    description: 'Complete package from RPTKA approval, Vitas, to working KITAS passport stamping.',
    estimatedFeeIndonesian: 'IDR 15,000,000 - IDR 22,000,000',
  },
  {
    id: 'srv-004',
    name: 'Visa On Arrival (VOA) Extension',
    category: 'Visas & VOA',
    estimatedDays: '3 - 5 Working Days',
    requirements: ['Original Passport', 'Return Flight Ticket out of Indonesia', 'Proof of First VOA'],
    description: 'Extension of 30-day VOA tourist stay permit without queuing at immigration.',
    estimatedFeeIndonesian: 'IDR 1,200,000 - IDR 1,800,000',
  },
  {
    id: 'srv-005',
    name: 'KITAP Permanent Residence Permit (5 Years)',
    category: 'Residence Permits (KITAS/KITAP)',
    estimatedDays: '14 - 30 Working Days',
    requirements: ['Continuous active KITAS for min. 3-4 years', 'Valid Foreign Passport > 24 months', 'Sponsor Documents (PT PMA or Indonesian Spouse)'],
    description: 'Status conversion from KITAS to 5-year Permanent Residence Permit (KITAP).',
    estimatedFeeIndonesian: 'IDR 25,000,000 - IDR 35,000,000',
  },
  {
    id: 'srv-006',
    name: 'EPO (Exit Permit Only) & ERP',
    category: 'Residence Permits (KITAS/KITAP)',
    estimatedDays: '2 - 3 Working Days',
    requirements: ['Original Passport', 'Original KITAS', 'Departure Flight Ticket'],
    description: 'Cancellation and handover of immigration documents when an expat terminates stay or employment.',
    estimatedFeeIndonesian: 'IDR 1,500,000 - IDR 2,500,000',
  },
];

export const INITIAL_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'tpl-01',
    title: 'Standard Client Expiry Reminder',
    language: 'English',
    content: `Dear *{CLIENT_NAME}*,

Greetings from *Synergy Success Consultant / A.R.I.S. Client Services*.

We would like to remind you that your Indonesian immigration document is approaching its expiration date:
📌 *Document*: {DOC_TYPE} (No: {DOC_NUMBER})
⏳ *Expiration Date*: *{EXPIRY_DATE}*
⚠️ *Time Remaining*: *{DAYS_LEFT} days left*.

To prevent overstay fines (IDR 1,000,000/day) and travel inconveniences, we recommend initiating the extension process promptly.

Our team is ready to process your documents online or collect required physical files. Please let us know if you would like us to begin processing today.

Thank you.
_A.R.I.S. Immigration & Success Consultant_
Phone/WhatsApp: {AGENCY_PHONE}`,
  },
  {
    id: 'tpl-02',
    title: 'Urgent Expat Renewal Notice',
    language: 'English',
    content: `URGENT NOTICE: *{CLIENT_NAME}*,

Greetings from *Synergy Success Consultant / A.R.I.S.*

This is an urgent reminder regarding your document:
📌 *Document*: {DOC_TYPE} (No: {DOC_NUMBER})
⏳ *Expiration Date*: {EXPIRY_DATE}
⚠️ *Days Remaining*: *{DAYS_LEFT} days left*.

Please note that Indonesian immigration rules strictly enforce overstay penalties and travel bans for expired permits. 

Please reply to this message or contact us immediately so we can file your extension submission today.

Best regards,
_A.R.I.S. Client Support Team_
WhatsApp/Phone: {AGENCY_PHONE}`,
  },
  {
    id: 'tpl-03',
    title: 'Corporate Sponsor Expiry Notification',
    language: 'Bilingual',
    content: `Subject: IMMIGRATION EXPIRY NOTICE - {CLIENT_NAME} ({COMPANY_NAME})

Attention:
HR Manager / Company Sponsor
{COMPANY_NAME}

Dear Sir/Madam,

This is an official notification from A.R.I.S. (Synergy Success Consultant) regarding the expiration schedule of your foreign worker / investor immigration permit:

Client Name     : {CLIENT_NAME}
Document Type   : {DOC_TYPE}
Document Number : {DOC_NUMBER}
Expiry Date     : {EXPIRY_DATE}
Days Remaining  : {DAYS_LEFT} Days

Immigration processing and verification requires 7-14 working days. Please confirm whether we should proceed with the permit extension for the above-mentioned personnel.

Sincerely,
Immigration Consultant Team
A.R.I.S. — Synergy Success Consultant`,
  },
];
