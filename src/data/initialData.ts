import { Client, ImmigrationDocument, AgencyService, ReminderTemplate } from '../types';
import { getDateDaysFromNow } from '../utils/dateUtils';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Alexander Volkov',
    nationality: 'Rusia',
    passportNo: '75N982412',
    clientType: 'Expat',
    companyName: 'PT Bali Digital Investama',
    phone: '6281234567890',
    email: 'a.volkov@balidigital.id',
    address: 'Jl. Sunset Road No. 88, Seminyak, Bali',
    notes: 'Pemegang KITAS Investor 2 Tahun. Butuh penawaran perpanjangan & alih status.',
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
    address: 'Jl. Raya Canggu No. 12, Badung, Bali',
    notes: 'Pemegang KITAS Kerja (Direktur Operasional).',
    createdAt: '2025-02-10',
  },
  {
    id: 'cli-003',
    name: 'Kenji Takahashi',
    nationality: 'Jepang',
    passportNo: 'TK902814',
    clientType: 'Corporate',
    companyName: 'PT Nusantara Manufacturing Tech',
    phone: '6282111223344',
    email: 'takahashi@nusantaratech.co.id',
    address: 'Kawasan Industri MM2100, Cikarang, Jawa Barat',
    notes: 'Penanggung jawab expatriat Jepang di Jakarta/Cikarang.',
    createdAt: '2024-11-01',
  },
  {
    id: 'cli-004',
    name: 'Budi Santoso',
    nationality: 'Indonesia (WNI)',
    passportNo: 'X1829402',
    clientType: 'Individual',
    companyName: 'Pribadi',
    phone: '6285678901234',
    email: 'budi.santoso@yahoo.com',
    address: 'Jl. Wijaya No. 45, Kebayoran Baru, Jakarta Selatan',
    notes: 'Perpanjangan Paspor WNI 10 Tahun untuk perjalanan bisnis Singapura.',
    createdAt: '2025-03-01',
  },
  {
    id: 'cli-005',
    name: 'Maria Carmen Garcia',
    nationality: 'Spanyol',
    passportNo: 'ESP782910',
    clientType: 'Expat',
    companyName: 'PT Synergy Resort & Hospitality',
    phone: '6281333444555',
    email: 'maria.garcia@synergyresort.com',
    address: 'Ubud Kayu Manis No. 5, Gianyar, Bali',
    notes: 'Membutuhkan perpanjangan VOA & pengurusan KITAS Keluarga.',
    createdAt: '2025-03-20',
  },
  {
    id: 'cli-006',
    name: 'David Chen',
    nationality: 'Singapura',
    passportNo: 'K8920192',
    clientType: 'Corporate',
    companyName: 'PT Chen Global Ventures',
    phone: '6591234567',
    email: 'david@chenglobal.sg',
    address: 'SCBD District 8, Tower Treasury, Jakarta Selatan',
    notes: 'PMA Investor & Komisaris Utama.',
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
    docType: 'KITAS Investor',
    docNumber: '2C12EF8901-M',
    country: 'Rusia',
    issueDate: '2024-08-01',
    expiryDate: getDateDaysFromNow(12), // 12 days left (CRITICAL alert)
    sponsorName: 'PT Bali Digital Investama',
    status: 'Renewal_Due',
    processStage: 'Pengumpulan Berkas Client',
    notes: 'Client sudah diinfokan bahwa KITAS tinggal 12 hari lagi. Menunggu kelengkapan laporan LKPM.',
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
    docType: 'Paspor WNA',
    docNumber: '75N982412',
    country: 'Rusia',
    issueDate: '2016-09-10',
    expiryDate: getDateDaysFromNow(48), // 48 days left (WARNING alert)
    sponsorName: 'Pribadi',
    status: 'Active',
    processStage: 'Berkas Belum Diterima',
    notes: 'Paspor tersisa < 6 bulan. Perlu perpanjangan di Kedutaan Rusia sebelum submit KITAS.',
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
    docType: 'KITAS Kerja',
    docNumber: '2C11AB3412-K',
    country: 'Australia',
    issueDate: '2024-09-01',
    expiryDate: getDateDaysFromNow(-4), // Expired 4 days ago! (EXPIRED alert)
    sponsorName: 'PT Synergy Utama Global',
    status: 'Expired',
    processStage: 'Submit Online / Imigrasi',
    notes: 'Perhatian: Masa berlaku lewat 4 hari! Kena denda overstay atau perlu pengurusan izin khusus.',
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
    docType: 'KITAP',
    docNumber: '5C10ZZ9912-P',
    country: 'Jepang',
    issueDate: '2021-09-20',
    expiryDate: getDateDaysFromNow(75), // 75 days left (ATTENTION alert)
    sponsorName: 'PT Nusantara Manufacturing Tech',
    status: 'Active',
    processStage: 'Berkas Belum Diterima',
    notes: 'KITAP 5 tahunan mau perpanjangan/MERP. Jadwal kontak ke HR Perusahaan bulan depan.',
    reminderSentCount: 0,
  },
  {
    id: 'doc-005',
    clientId: 'cli-004',
    clientName: 'Budi Santoso',
    clientPhone: '6285678901234',
    clientEmail: 'budi.santoso@yahoo.com',
    companyName: 'Pribadi',
    docType: 'Paspor WNI',
    docNumber: 'X1829402',
    country: 'Indonesia',
    issueDate: '2020-04-10',
    expiryDate: getDateDaysFromNow(22), // 22 days left (CRITICAL alert)
    sponsorName: 'Pribadi',
    status: 'In_Progress',
    processStage: 'Jadwal Biometrik & Foto',
    notes: 'Sudah mendaftar M-Paspor. Jadwal foto di Kantor Imigrasi Kelas I Jaksel hari Kamis.',
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
    docType: 'VOA / ITK',
    docNumber: 'VOA-88291029',
    country: 'Spanyol',
    issueDate: '2025-03-01',
    expiryDate: getDateDaysFromNow(8), // 8 days left (CRITICAL alert)
    sponsorName: 'PT Synergy Resort & Hospitality',
    status: 'Renewal_Due',
    processStage: 'Submit Online / Imigrasi',
    notes: 'VOA Extension 30 hari kedua di Imigrasi Denpasar.',
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
    docType: 'KITAS Investor',
    docNumber: '2C15FF1122-M',
    country: 'Singapura',
    issueDate: '2024-11-15',
    expiryDate: getDateDaysFromNow(240), // 240 days left (SAFE alert)
    sponsorName: 'PT Chen Global Ventures',
    status: 'Active',
    processStage: 'Selesai & Diserahkan',
    notes: 'KITAS Investor 2 tahun baru terbit bulan November.',
    reminderSentCount: 0,
  },
];

export const INITIAL_SERVICES: AgencyService[] = [
  {
    id: 'srv-001',
    name: 'Pengurusan Paspor WNI (Elektronik / Biasa)',
    category: 'Paspor',
    estimatedDays: '1 - 3 Hari Kerja',
    requirements: ['e-KTP', 'Kartu Keluarga', 'Akte Kelahiran / Ijazah / Buku Nikah', 'Paspor Lama (jika perpanjangan)'],
    description: 'Layanan pendampingan & percepatan antrean M-Paspor, foto biometrik hingga pengambilan paspor WNI.',
    estimatedFeeIndonesian: 'Rp 650.000 - Rp 1.500.000 (Sesuai paket kilat)',
  },
  {
    id: 'srv-002',
    name: 'KITAS Investor (PMA 1 - 2 Tahun)',
    category: 'Izin Tinggal (KITAS/KITAP)',
    estimatedDays: '7 - 14 Hari Kerja',
    requirements: ['Paspor WNA valid > 18 bulan', 'NIB & Izin Usaha PT PMA', 'Akta Pendirian PT PMA & SK Kemenkumham', 'Kepemilikan Saham min. Rp 10 Miliar / PMA rules'],
    description: 'Izin tinggal terbatas untuk investor / pemegang saham PT PMA di Indonesia.',
    estimatedFeeIndonesian: 'Rp 12.000.000 - Rp 18.000.000',
  },
  {
    id: 'srv-003',
    name: 'KITAS TKA (Tenaga Kerja Asing)',
    category: 'Izin Tinggal (KITAS/KITAP)',
    estimatedDays: '10 - 20 Hari Kerja',
    requirements: ['Paspor WNA', 'RPTKA yang disetujui Kemnaker', 'DKP-TKA ($1,200/tahun)', 'Ijazah & Sertifikat Pengalaman Kerja', 'Asuransi Kesehatan'],
    description: 'Paket lengkap pengurusan RPTKA, Vitas, hingga stempel KITAS kerja TKA.',
    estimatedFeeIndonesian: 'Rp 15.000.000 - Rp 22.000.000',
  },
  {
    id: 'srv-004',
    name: 'Perpanjangan VOA (Visa On Arrival)',
    category: 'Visa & VOA',
    estimatedDays: '3 - 5 Hari Kerja',
    requirements: ['Paspor Asli', 'Tiket Keluar Indonesia (Return Ticket)', 'Bukti VOA pertama'],
    description: 'Perpanjangan izin tinggal kunjungan VOA 30 hari tambahan tanpa repot antre.',
    estimatedFeeIndonesian: 'Rp 1.200.000 - Rp 1.800.000',
  },
  {
    id: 'srv-005',
    name: 'Pengurusan KITAP (Izin Tinggal Tetap 5 Tahun)',
    category: 'Izin Tinggal (KITAS/KITAP)',
    estimatedDays: '14 - 30 Hari Kerja',
    requirements: ['KITAS aktif berturut-turut min. 3-4 tahun', 'Paspor WNA valid > 24 bulan', 'Dokumen Sponsor PT PMA / Suami-Istri WNI'],
    description: 'Alih status dari KITAS ke KITAP dengan masa berlaku 5 tahun.',
    estimatedFeeIndonesian: 'Rp 25.000.000 - Rp 35.000.000',
  },
  {
    id: 'srv-006',
    name: 'EPO (Exit Permit Only) & ERP',
    category: 'Izin Tinggal (KITAS/KITAP)',
    estimatedDays: '2 - 3 Hari Kerja',
    requirements: ['Paspor Asli', 'KITAS Asli', 'Tiket Pesawat Kepulangan Negara Asal'],
    description: 'Pengembalian dokumen keimigrasian saat expat mengakhiri masa kerja / tinggal di Indonesia.',
    estimatedFeeIndonesian: 'Rp 1.500.000 - Rp 2.500.000',
  },
];

export const INITIAL_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'tpl-01',
    title: 'WhatsApp Pengingat Perpanjangan (Bahasa Indonesia)',
    language: 'Indonesia',
    content: `Halo Bpk/Ibu *{CLIENT_NAME}*,

Salam hangat dari *Synergy Success Consultant / A.R.I.S. Biro Jasa*.

Melalui pesan ini, kami ingin menginformasikan bahwa dokumen keimigrasian Anda:
📌 *{DOC_TYPE}* (No: {DOC_NUMBER})
⏳ Masa Berlaku Expired: *{EXPIRY_DATE}*
⚠️ Sisa Waktu: *{DAYS_LEFT} hari lagi*.

Agar terhindar dari denda overstay dan kendala administrasi perjalanan, kami menyarankan agar proses perpanjangan segera dimulai sekarang.

Persyaratan & berkas dapat kami bantu jemput / proses online. Apakah Bpk/Ibu bersedia kami bantu proseskan hari ini?

Terima kasih.
_A.R.I.S. Imigrasi & Success Consultant_
Telp/WA: {AGENCY_PHONE}`,
  },
  {
    id: 'tpl-02',
    title: 'WhatsApp Reminder (English for Expats)',
    language: 'English',
    content: `Dear *{CLIENT_NAME}*,

Warm greetings from *Synergy Success Consultant / A.R.I.S. Immigration Services*.

This is a polite reminder regarding your Indonesian immigration document:
📌 *Document*: {DOC_TYPE} (No: {DOC_NUMBER})
⏳ *Expiration Date*: {EXPIRY_DATE}
⚠️ *Days Remaining*: *{DAYS_LEFT} days left*.

To avoid overstay fines (IDR 1,000,000/day) or travel disruptions, we strongly recommend initiating your extension process as soon as possible.

Our team is ready to assist you with all the required sponsorship paperwork and immigration procedures. Please reply to this message or contact us to confirm your extension.

Best regards,
_A.R.I.S. Client Support Team_
WhatsApp/Phone: {AGENCY_PHONE}`,
  },
  {
    id: 'tpl-03',
    title: 'Official Email Notification (Corporate Sponsor)',
    language: 'Bilingual',
    content: `Subject: PEMBERITAHUAN JATUH TEMPO DOKUMEN KEIMIGRASIAN / IMMIGRATION EXPIRY NOTICE - {CLIENT_NAME} ({COMPANY_NAME})

Kepada Yth.
HR Manager / Sponsor
{COMPANY_NAME}

Dengan hormat,

Kami dari Biro Jasa Keimigrasian A.R.I.S. (Synergy Success Consultant) memberitahukan jadwal jatuh tempo dokumen Tenaga Kerja Asing / Investor di perusahaan Anda:

Nama TKA/Client : {CLIENT_NAME}
Jenis Dokumen   : {DOC_TYPE}
Nomor Dokumen   : {DOC_NUMBER}
Tanggal Expired : {EXPIRY_DATE}
Sisa Masa Berlaku: {DAYS_LEFT} Hari

Mengingat proses verifikasi di Kantor Imigrasi membutuhkan waktu 7-14 hari kerja, mohon tanggapan untuk kelanjutan proses perpanjangan izin tinggal ybs.

Hormat kami,
Tim Konsultan Keimigrasian A.R.I.S.
Synergy Success Consultant`,
  },
];
