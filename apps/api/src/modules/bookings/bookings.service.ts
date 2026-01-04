import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CheckInDto, CheckType } from './dto/check-in.dto';

@Injectable()
export class BookingsService {
  private readonly GEOFENCE_RADIUS_METERS = 100; // 100m geofence

  constructor(private readonly prisma: PrismaService) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    // Get participant for this user
    const participant = await this.prisma.participant.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!participant) {
      throw new NotFoundException('Participant profile not found');
    }

    // Validate provider exists and is active
    const provider = await this.prisma.provider.findUnique({
      where: { id: dto.providerId },
      include: { user: true },
    });

    if (!provider || provider.user.status !== 'active') {
      throw new NotFoundException('Provider not found or not active');
    }

    // Validate provider service exists
    const providerService = await this.prisma.providerService.findUnique({
      where: { id: dto.providerServiceId },
    });

    if (!providerService || providerService.providerId !== dto.providerId) {
      throw new BadRequestException('Invalid provider service');
    }

    // Calculate duration
    const startTime = this.parseTime(dto.scheduledStartTime);
    const endTime = this.parseTime(dto.scheduledEndTime);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    if (durationHours <= 0) {
      throw new BadRequestException('End time must be after start time');
    }

    // Get the appropriate rate (default to weekday rate or base rate)
    const rate = providerService.weekdayRate || providerService.baseRate || 0;

    // Calculate estimated total
    const estimatedTotal = Number(rate) * durationHours;

    // Generate booking number
    const bookingNumber = await this.generateBookingNumber();

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber,
        participantId: participant.id,
        providerId: dto.providerId,
        providerServiceId: dto.providerServiceId,
        createdByUserId: userId,
        createdByRole: 'participant',
        serviceType: dto.serviceType as any,
        scheduledDate: new Date(dto.scheduledDate),
        scheduledStartTime: startTime,
        scheduledEndTime: endTime,
        scheduledDurationHours: durationHours,
        serviceAddressLine1: dto.serviceAddressLine1,
        serviceAddressLine2: dto.serviceAddressLine2,
        serviceSuburb: dto.serviceSuburb,
        serviceState: dto.serviceState as any,
        servicePostcode: dto.servicePostcode,
        serviceLatitude: dto.serviceLatitude,
        serviceLongitude: dto.serviceLongitude,
        quotedRate: rate,
        rateType: providerService.pricingType,
        estimatedTotal,
        participantNotes: dto.participantNotes,
        status: 'pending',
        providerResponseDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      include: {
        provider: {
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        providerService: true,
      },
    });

    // Create status history
    await this.createStatusHistory(booking.id, null, 'pending', userId, 'participant');

    return this.formatBookingResponse(booking);
  }

  async getBookingById(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        participant: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, phone: true },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, phone: true },
            },
          },
        },
        providerService: true,
        checkIns: {
          orderBy: { createdAt: 'asc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify user has access
    const hasAccess =
      booking.participant.userId === userId ||
      booking.provider.userId === userId ||
      booking.createdByUserId === userId;

    if (!hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  async getParticipantBookings(userId: string, options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const participant = await this.prisma.participant.findUnique({
      where: { userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant profile not found');
    }

    return this.getBookings({
      participantId: participant.id,
      ...options,
    });
  }

  async getProviderBookings(userId: string, options?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.getBookings({
      providerId: provider.id,
      ...options,
    });
  }

  async acceptBooking(userId: string, bookingId: string) {
    const booking = await this.getBookingForProvider(userId, bookingId);

    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking cannot be accepted in current status');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'accepted',
        providerResponseAt: new Date(),
      },
    });

    await this.createStatusHistory(bookingId, 'pending', 'accepted', userId, 'provider');

    return { message: 'Booking accepted', status: updated.status };
  }

  async declineBooking(userId: string, bookingId: string, reason: string) {
    const booking = await this.getBookingForProvider(userId, bookingId);

    if (booking.status !== 'pending') {
      throw new BadRequestException('Booking cannot be declined in current status');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'declined',
        providerResponseAt: new Date(),
        declineReason: reason,
      },
    });

    await this.createStatusHistory(bookingId, 'pending', 'declined', userId, 'provider', reason);

    return { message: 'Booking declined', status: updated.status };
  }

  async cancelBooking(userId: string, bookingId: string, reason: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        participant: true,
        provider: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Verify user has access
    const isParticipant = booking.participant.userId === userId;
    const isProvider = booking.provider.userId === userId;

    if (!isParticipant && !isProvider) {
      throw new ForbiddenException('Access denied');
    }

    // Cannot cancel completed or already cancelled bookings
    if (['completed', 'cancelled'].includes(booking.status)) {
      throw new BadRequestException('Booking cannot be cancelled');
    }

    const role = isParticipant ? 'participant' : 'provider';

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: userId,
        cancellationReason: reason,
      },
    });

    await this.createStatusHistory(bookingId, booking.status, 'cancelled', userId, role, reason);

    return { message: 'Booking cancelled', status: updated.status };
  }

  // GPS Check-in/Check-out
  async checkIn(userId: string, bookingId: string, dto: CheckInDto) {
    const booking = await this.getBookingForProvider(userId, bookingId);

    if (booking.status !== 'accepted' && booking.status !== 'in_progress') {
      throw new BadRequestException('Cannot check in for this booking');
    }

    // Calculate distance from service location
    let distanceMeters: number | null = null;
    let isWithinGeofence: boolean | null = null;

    if (booking.serviceLatitude && booking.serviceLongitude) {
      distanceMeters = this.calculateDistance(
        dto.latitude,
        dto.longitude,
        Number(booking.serviceLatitude),
        Number(booking.serviceLongitude),
      );
      isWithinGeofence = distanceMeters <= this.GEOFENCE_RADIUS_METERS;
    }

    // Create check-in record
    const checkIn = await this.prisma.bookingCheckIn.create({
      data: {
        bookingId,
        userId,
        checkType: dto.checkType as any,
        latitude: dto.latitude,
        longitude: dto.longitude,
        accuracyMeters: dto.accuracyMeters,
        isWithinGeofence,
        distanceFromServiceLocationMeters: distanceMeters,
        photoUrl: dto.photoUrl,
      },
    });

    // Update booking status based on check type
    if (dto.checkType === CheckType.CHECK_IN) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'in_progress',
          actualStartTime: new Date(),
        },
      });
      await this.createStatusHistory(bookingId, booking.status, 'in_progress', userId, 'provider');
    } else if (dto.checkType === CheckType.CHECK_OUT) {
      const actualEndTime = new Date();
      const actualDurationHours = booking.actualStartTime
        ? (actualEndTime.getTime() - booking.actualStartTime.getTime()) / (1000 * 60 * 60)
        : null;

      await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'pending_confirmation',
          actualEndTime,
          actualDurationHours,
          confirmationDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
        },
      });
      await this.createStatusHistory(bookingId, 'in_progress', 'pending_confirmation', userId, 'provider');
    }

    return {
      ...checkIn,
      isWithinGeofence,
      distanceMeters,
    };
  }

  // Dual Confirmation
  async confirmAsProvider(userId: string, bookingId: string) {
    const booking = await this.getBookingForProvider(userId, bookingId);

    if (booking.status !== 'pending_confirmation') {
      throw new BadRequestException('Booking is not pending confirmation');
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        providerConfirmedAt: new Date(),
        providerConfirmedBy: userId,
      },
    });

    // Check if both confirmed
    const updated = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (updated?.participantConfirmedAt) {
      await this.completeBooking(bookingId, userId);
    }

    return { message: 'Provider confirmation recorded' };
  }

  async confirmAsParticipant(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { participant: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.participant.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (booking.status !== 'pending_confirmation') {
      throw new BadRequestException('Booking is not pending confirmation');
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        participantConfirmedAt: new Date(),
        participantConfirmedBy: userId,
      },
    });

    // Check if both confirmed
    const updated = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (updated?.providerConfirmedAt) {
      await this.completeBooking(bookingId, userId);
    }

    return { message: 'Participant confirmation recorded' };
  }

  private async completeBooking(bookingId: string, userId: string) {
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'completed' },
    });

    await this.createStatusHistory(bookingId, 'pending_confirmation', 'completed', userId, 'system');

    // TODO: Trigger invoice generation
  }

  // Helper methods
  private async getBookingForProvider(userId: string, bookingId: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.providerId !== provider.id) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  private async getBookings(options: {
    participantId?: string;
    providerId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (options.participantId) where.participantId = options.participantId;
    if (options.providerId) where.providerId = options.providerId;
    if (options.status) where.status = options.status;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { scheduledDate: 'desc' },
        include: {
          participant: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          provider: {
            include: {
              user: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          providerService: {
            select: { serviceName: true },
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      bookings: bookings.map(this.formatBookingResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const prefix = `VC${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${random}`;
  }

  private parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private async createStatusHistory(
    bookingId: string,
    fromStatus: string | null,
    toStatus: string,
    userId: string,
    role: string,
    reason?: string,
  ) {
    await this.prisma.bookingStatusHistory.create({
      data: {
        bookingId,
        fromStatus,
        toStatus,
        changedBy: userId,
        changedByRole: role,
        reason,
      },
    });
  }

  private formatBookingResponse(booking: any) {
    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      serviceType: booking.serviceType,
      scheduledDate: booking.scheduledDate,
      scheduledStartTime: booking.scheduledStartTime,
      scheduledEndTime: booking.scheduledEndTime,
      scheduledDurationHours: booking.scheduledDurationHours,
      estimatedTotal: booking.estimatedTotal,
      provider: booking.provider
        ? {
            id: booking.provider.id,
            businessName: booking.provider.businessName,
            name: `${booking.provider.user?.firstName} ${booking.provider.user?.lastName}`,
          }
        : null,
      participant: booking.participant
        ? {
            id: booking.participant.id,
            name: `${booking.participant.user?.firstName} ${booking.participant.user?.lastName}`,
          }
        : null,
      service: booking.providerService
        ? {
            id: booking.providerService.id,
            name: booking.providerService.serviceName,
          }
        : null,
      createdAt: booking.createdAt,
    };
  }
}
