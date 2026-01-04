// User types
export type UserType = 'participant' | 'coordinator' | 'provider' | 'admin';
export type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated';

// Australian states
export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'SA' | 'WA' | 'NT' | 'TAS' | 'ACT';

// Plan management types
export type PlanManagementType = 'self' | 'plan' | 'agency';

// Service types
export type ServiceType = 'domestic_cleaning' | 'community_transport' | 'yard_maintenance';

// Booking statuses
export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'in_progress'
  | 'pending_confirmation'
  | 'completed'
  | 'disputed'
  | 'invoiced';

// Compliance statuses
export type ComplianceStatus = 'pending' | 'verified' | 'expired' | 'suspended';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
    totalPages?: number;
  };
}

// Pagination
export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  status: UserStatus;
  avatarUrl?: string;
}

// Provider
export interface Provider {
  id: string;
  userId: string;
  businessName: string;
  abn: string;
  complianceStatus: ComplianceStatus;
  serviceTypes: ServiceType[];
  averageRating: number;
  totalReviews: number;
  fairPriceScore?: number;
}

// Provider Service
export interface ProviderService {
  id: string;
  providerId: string;
  serviceType: ServiceType;
  serviceName: string;
  description?: string;
  baseRate: number;
  minimumBookingHours: number;
  weekdayRate?: number;
  eveningRate?: number;
  saturdayRate?: number;
  sundayRate?: number;
  publicHolidayRate?: number;
}

// Booking
export interface Booking {
  id: string;
  bookingNumber: string;
  participantId: string;
  providerId: string;
  providerServiceId: string;
  serviceType: ServiceType;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  scheduledDurationHours: number;
  quotedRate: number;
  estimatedTotal: number;
  status: BookingStatus;
  providerConfirmedAt?: string;
  participantConfirmedAt?: string;
}

// Fair Price Score
export interface FairPriceScore {
  overall: number;
  priceComponent: number;
  ratingComponent: number;
  responseComponent: number;
  reliabilityComponent: number;
  percentBelowCap: number;
}

// Notification
export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string;
  readAt?: string;
  createdAt: string;
}
