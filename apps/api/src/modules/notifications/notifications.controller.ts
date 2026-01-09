import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { SendEmailDto, SendSmsDto } from './dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Get notification service status' })
  @ApiResponse({ status: 200, description: 'Service status' })
  getStatus() {
    return this.notificationsService.getStatus();
  }

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User notifications' })
  async getUserNotifications(
    @CurrentUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getUserNotifications(userId, {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) notificationId: string,
  ) {
    await this.notificationsService.markAsRead(userId, notificationId);
    return { success: true };
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  // Testing endpoints (for development/testing only)

  @Post('test/email')
  @ApiOperation({ summary: 'Send test email (dev only)' })
  @ApiResponse({ status: 200, description: 'Test email sent' })
  async sendTestEmail(@Body() dto: SendEmailDto) {
    return this.emailService.sendEmail(dto);
  }

  @Post('test/sms')
  @ApiOperation({ summary: 'Send test SMS (dev only)' })
  @ApiResponse({ status: 200, description: 'Test SMS sent' })
  async sendTestSms(@Body() dto: SendSmsDto) {
    return this.smsService.sendSms(dto);
  }

  @Get('test/sent-emails')
  @ApiOperation({ summary: 'Get sent emails (mock mode only)' })
  @ApiResponse({ status: 200, description: 'List of sent emails in mock mode' })
  getSentEmails() {
    return {
      mockMode: this.emailService.isMockMode(),
      emails: this.emailService.getSentEmails(),
    };
  }

  @Get('test/sent-sms')
  @ApiOperation({ summary: 'Get sent SMS (mock mode only)' })
  @ApiResponse({ status: 200, description: 'List of sent SMS in mock mode' })
  getSentSms() {
    return {
      mockMode: this.smsService.isMockMode(),
      sms: this.smsService.getSentSms(),
    };
  }

  @Post('test/clear')
  @ApiOperation({ summary: 'Clear test data (mock mode only)' })
  @ApiResponse({ status: 200, description: 'Test data cleared' })
  clearTestData() {
    this.emailService.clearSentEmails();
    this.smsService.clearSentSms();
    return { success: true, message: 'Test data cleared' };
  }
}
