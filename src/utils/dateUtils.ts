import { ExpiryAlertLevel, ExpiryAlert } from '../types';

/**
 * Calculates days remaining until expiration date from today.
 * Negative number means already expired.
 */
export function getDaysUntilExpiry(expiryDateStr: string): number {
  if (!expiryDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Categorizes alert level based on Indonesian immigration guidelines:
 * - EXPIRED: < 0 days (overstay risk/invalid passport)
 * - CRITICAL: 0 - 30 days (URGENT! Overstay fine Rp 1,000,000/day or passport invalid for flight)
 * - WARNING: 31 - 60 days (Time to prepare extension documents)
 * - ATTENTION: 61 - 90 days (Early reminder for corporate sponsors)
 * - SAFE: > 90 days
 */
export function getExpiryAlertLevel(daysLeft: number): ExpiryAlertLevel {
  if (daysLeft < 0) return 'EXPIRED';
  if (daysLeft <= 30) return 'CRITICAL';
  if (daysLeft <= 60) return 'WARNING';
  if (daysLeft <= 90) return 'ATTENTION';
  return 'SAFE';
}

export function getExpiryAlertConfig(alertLevel: ExpiryAlertLevel): ExpiryAlert {
  switch (alertLevel) {
    case 'EXPIRED':
      return {
        level: 'EXPIRED',
        label: 'Expired (Overstay Risk)',
        colorClass: 'text-white font-black',
        bgClass: 'bg-rose-600',
        borderClass: 'border-rose-700 shadow-2xs',
        description: 'Document has expired! Immediate action required.',
      };
    case 'CRITICAL':
      return {
        level: 'CRITICAL',
        label: 'Urgent (< 30 Days)',
        colorClass: 'text-rose-950 font-bold',
        bgClass: 'bg-rose-100',
        borderClass: 'border-rose-300',
        description: 'Expires in less than 30 days. Express renewal needed.',
      };
    case 'WARNING':
      return {
        level: 'WARNING',
        label: 'Warning (31-60 Days)',
        colorClass: 'text-amber-950 font-bold',
        bgClass: 'bg-amber-100',
        borderClass: 'border-amber-300',
        description: 'Time to contact client with renewal proposal.',
      };
    case 'ATTENTION':
      return {
        level: 'ATTENTION',
        label: 'Attention (61-90 Days)',
        colorClass: 'text-blue-950 font-bold',
        bgClass: 'bg-blue-100',
        borderClass: 'border-blue-300',
        description: 'Early reminder to prepare sponsor documentation.',
      };
    case 'SAFE':
    default:
      return {
        level: 'SAFE',
        label: 'Valid (> 90 Days)',
        colorClass: 'text-emerald-950 font-bold',
        bgClass: 'bg-emerald-100',
        borderClass: 'border-emerald-300',
        description: 'Sufficient validity remaining.',
      };
  }
}

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
}

/**
 * Returns date offset string from today in YYYY-MM-DD format
 */
export function getDateDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
