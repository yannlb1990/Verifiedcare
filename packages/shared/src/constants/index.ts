// Australian States
export const AUSTRALIAN_STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'NT', 'TAS', 'ACT'] as const;

// Service Types
export const SERVICE_TYPES = {
  DOMESTIC_CLEANING: 'domestic_cleaning',
  COMMUNITY_TRANSPORT: 'community_transport',
  YARD_MAINTENANCE: 'yard_maintenance',
} as const;

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  domestic_cleaning: 'Domestic Cleaning',
  community_transport: 'Community Transport',
  yard_maintenance: 'Yard Maintenance',
};

export const SERVICE_TYPE_ICONS: Record<string, string> = {
  domestic_cleaning: '🏠',
  community_transport: '🚗',
  yard_maintenance: '🌿',
};

// Booking Statuses
export const BOOKING_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELLED: 'cancelled',
  IN_PROGRESS: 'in_progress',
  PENDING_CONFIRMATION: 'pending_confirmation',
  COMPLETED: 'completed',
  DISPUTED: 'disputed',
  INVOICED: 'invoiced',
} as const;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  cancelled: 'Cancelled',
  in_progress: 'In Progress',
  pending_confirmation: 'Awaiting Confirmation',
  completed: 'Completed',
  disputed: 'Disputed',
  invoiced: 'Invoiced',
};

// Platform Settings
export const PLATFORM_SETTINGS = {
  MIN_PLATFORM_FEE_PERCENTAGE: 8,
  MAX_PLATFORM_FEE_PERCENTAGE: 12,
  DEFAULT_PLATFORM_FEE_PERCENTAGE: 10,
  PROVIDER_RESPONSE_HOURS: 24,
  CONFIRMATION_TIMEOUT_HOURS: 48,
  MIN_CANCELLATION_HOURS: 24,
  CANCELLATION_FEE_PERCENTAGE: 50,
  GEOFENCE_RADIUS_METERS: 200,
} as const;

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
  },
  USERS: {
    ME: '/api/v1/users/me',
    UPDATE_PROFILE: '/api/v1/users/me',
  },
  PROVIDERS: {
    LIST: '/api/v1/providers',
    SEARCH: '/api/v1/providers/search',
    GET: (id: string) => `/api/v1/providers/${id}`,
    SERVICES: (id: string) => `/api/v1/providers/${id}/services`,
  },
  BOOKINGS: {
    LIST: '/api/v1/bookings',
    CREATE: '/api/v1/bookings',
    GET: (id: string) => `/api/v1/bookings/${id}`,
    CONFIRM: (id: string) => `/api/v1/bookings/${id}/confirm`,
    CANCEL: (id: string) => `/api/v1/bookings/${id}/cancel`,
    CHECK_IN: (id: string) => `/api/v1/bookings/${id}/check-in`,
    CHECK_OUT: (id: string) => `/api/v1/bookings/${id}/check-out`,
  },
  INVOICES: {
    LIST: '/api/v1/invoices',
    GET: (id: string) => `/api/v1/invoices/${id}`,
    DOWNLOAD: (id: string) => `/api/v1/invoices/${id}/pdf`,
  },
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  ABN: /^\d{11}$/,
  PHONE_AU: /^(\+61|0)[4-9]\d{8}$/,
  POSTCODE_AU: /^\d{4}$/,
  NDIS_NUMBER: /^\d{9}$/,
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DATE: 'dd MMM yyyy',
  DATE_SHORT: 'dd/MM/yyyy',
  TIME: 'h:mm a',
  DATETIME: 'dd MMM yyyy, h:mm a',
  DATETIME_FULL: 'EEEE, dd MMMM yyyy, h:mm a',
} as const;

// Timezones
export const AUSTRALIAN_TIMEZONES = [
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Adelaide',
  'Australia/Perth',
  'Australia/Darwin',
  'Australia/Hobart',
] as const;
