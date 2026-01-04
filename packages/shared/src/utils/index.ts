/**
 * Calculate Fair Price Score
 * A proprietary algorithm for scoring provider value
 */
export function calculateFairPriceScore(
  rate: number,
  ndisCapRate: number,
  rating: number,
  responseTimeHours: number,
  completionRate: number
): number {
  // Price component (0-1.5): Lower price relative to cap = higher score
  const priceRatio = rate / ndisCapRate;
  const priceScore = priceRatio <= 0.7 ? 1.5 : priceRatio <= 0.85 ? 1.2 : priceRatio <= 1 ? 1 : 0.5;

  // Rating component (0-1.5): Higher rating = higher score
  const ratingScore = (rating / 5) * 1.5;

  // Response time component (0-1): Faster response = higher score
  const responseScore =
    responseTimeHours <= 2 ? 1 : responseTimeHours <= 6 ? 0.8 : responseTimeHours <= 24 ? 0.5 : 0.2;

  // Completion rate component (0-1): Higher completion = higher score
  const completionScore = completionRate / 100;

  // Weighted total (max 5)
  const total = priceScore + ratingScore + responseScore + completionScore;

  return Math.min(5, Math.round(total * 10) / 10);
}

/**
 * Calculate percentage below NDIS cap
 */
export function getPercentageBelowCap(rate: number, ndisCapRate: number): number {
  if (rate >= ndisCapRate) return 0;
  return Math.round(((ndisCapRate - rate) / ndisCapRate) * 100);
}

/**
 * Format currency in AUD
 */
export function formatCurrency(amount: number, currency = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date for Australian locale
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    ...options,
  }).format(d);
}

/**
 * Calculate distance between two coordinates in kilometers
 */
export function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 10) / 10;
}

/**
 * Check if a point is within a geofence
 */
export function isWithinGeofence(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  radiusMeters: number
): boolean {
  const distanceKm = getDistanceInKm(lat1, lon1, lat2, lon2);
  return distanceKm * 1000 <= radiusMeters;
}

/**
 * Generate a booking number
 */
export function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VC-${year}-${random}`;
}

/**
 * Generate an invoice number
 */
export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VC-INV-${year}-${random}`;
}

/**
 * Validate Australian Business Number (ABN)
 */
export function isValidABN(abn: string): boolean {
  if (!/^\d{11}$/.test(abn)) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let sum = 0;

  for (let i = 0; i < 11; i++) {
    let digit = parseInt(abn[i], 10);
    if (i === 0) digit -= 1;
    sum += digit * weights[i];
  }

  return sum % 89 === 0;
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Delay for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
