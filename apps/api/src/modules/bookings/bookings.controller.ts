import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Participant endpoints
  @Post()
  @UseGuards(RolesGuard)
  @Roles('participant')
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async createBooking(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(user.id, dto);
  }

  @Get('participant')
  @UseGuards(RolesGuard)
  @Roles('participant')
  @ApiOperation({ summary: 'Get participant bookings' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getParticipantBookings(
    @CurrentUser() user: CurrentUserData,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.getParticipantBookings(user.id, {
      status,
      page,
      limit,
    });
  }

  @Post(':id/confirm/participant')
  @UseGuards(RolesGuard)
  @Roles('participant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm booking as participant (dual confirmation)' })
  async confirmAsParticipant(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.bookingsService.confirmAsParticipant(user.id, id);
  }

  // Provider endpoints
  @Get('provider')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @ApiOperation({ summary: 'Get provider bookings' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getProviderBookings(
    @CurrentUser() user: CurrentUserData,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookingsService.getProviderBookings(user.id, {
      status,
      page,
      limit,
    });
  }

  @Post(':id/accept')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Accept a booking request' })
  async acceptBooking(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.bookingsService.acceptBooking(user.id, id);
  }

  @Post(':id/decline')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Decline a booking request' })
  async declineBooking(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.bookingsService.declineBooking(user.id, id, reason);
  }

  @Post(':id/check-in')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GPS check-in or check-out' })
  @ApiResponse({ status: 200, description: 'Check-in recorded' })
  async checkIn(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: CheckInDto,
  ) {
    return this.bookingsService.checkIn(user.id, id, dto);
  }

  @Post(':id/confirm/provider')
  @UseGuards(RolesGuard)
  @Roles('provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm booking as provider (dual confirmation)' })
  async confirmAsProvider(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.bookingsService.confirmAsProvider(user.id, id);
  }

  // Shared endpoints
  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBooking(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.bookingsService.getBookingById(user.id, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a booking' })
  async cancelBooking(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.bookingsService.cancelBooking(user.id, id, reason);
  }
}
