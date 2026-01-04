import { z } from 'zod';
import { VALIDATION_PATTERNS, AUSTRALIAN_STATES, SERVICE_TYPES } from '../constants';

// Common schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.PHONE_AU, 'Invalid Australian phone number');

export const abnSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.ABN, 'ABN must be 11 digits');

export const postcodeSchema = z
  .string()
  .regex(VALIDATION_PATTERNS.POSTCODE_AU, 'Postcode must be 4 digits');

export const australianStateSchema = z.enum(AUSTRALIAN_STATES);

export const serviceTypeSchema = z.enum([
  SERVICE_TYPES.DOMESTIC_CLEANING,
  SERVICE_TYPES.COMMUNITY_TRANSPORT,
  SERVICE_TYPES.YARD_MAINTENANCE,
]);

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema.optional(),
  userType: z.enum(['participant', 'coordinator', 'provider']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Provider search schema
export const providerSearchSchema = z.object({
  serviceType: serviceTypeSchema,
  postcode: postcodeSchema.optional(),
  state: australianStateSchema.optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  duration: z.number().min(0.5).max(12).optional(),
  maxRate: z.number().positive().optional(),
  minRating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['fairPriceScore', 'rating', 'distance', 'price']).optional(),
  page: z.number().int().positive().optional(),
  perPage: z.number().int().positive().max(50).optional(),
});

// Booking schemas
export const createBookingSchema = z.object({
  providerId: z.string().uuid(),
  providerServiceId: z.string().uuid(),
  scheduledDate: z.string(),
  scheduledStartTime: z.string(),
  scheduledEndTime: z.string(),
  serviceAddressLine1: z.string().min(1, 'Address is required'),
  serviceAddressLine2: z.string().optional(),
  serviceSuburb: z.string().min(1, 'Suburb is required'),
  serviceState: australianStateSchema,
  servicePostcode: postcodeSchema,
  participantNotes: z.string().max(1000).optional(),
});

export const confirmBookingSchema = z.object({
  confirmedDuration: z.number().min(0.5).optional(),
  notes: z.string().max(1000).optional(),
});

// Provider profile schemas
export const providerProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  abn: abnSchema,
  bio: z.string().max(2000).optional(),
  serviceTypes: z.array(serviceTypeSchema).min(1, 'Select at least one service type'),
  serviceRadiusKm: z.number().int().min(1).max(100),
  serviceStates: z.array(australianStateSchema).min(1, 'Select at least one state'),
});

export const providerServiceSchema = z.object({
  serviceType: serviceTypeSchema,
  serviceName: z.string().min(1, 'Service name is required'),
  description: z.string().max(1000).optional(),
  baseRate: z.number().positive('Rate must be positive'),
  minimumBookingHours: z.number().min(0.5).max(8),
  weekdayRate: z.number().positive().optional(),
  eveningRate: z.number().positive().optional(),
  saturdayRate: z.number().positive().optional(),
  sundayRate: z.number().positive().optional(),
  publicHolidayRate: z.number().positive().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
});

// Review schema
export const createReviewSchema = z.object({
  overallRating: z.number().int().min(1).max(5),
  punctualityRating: z.number().int().min(1).max(5).optional(),
  qualityRating: z.number().int().min(1).max(5).optional(),
  communicationRating: z.number().int().min(1).max(5).optional(),
  valueRating: z.number().int().min(1).max(5).optional(),
  reviewText: z.string().max(2000).optional(),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProviderSearchInput = z.infer<typeof providerSearchSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ConfirmBookingInput = z.infer<typeof confirmBookingSchema>;
export type ProviderProfileInput = z.infer<typeof providerProfileSchema>;
export type ProviderServiceInput = z.infer<typeof providerServiceSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
