import {
  Controller,
  Get,
  Post,
  Patch,
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
import { ProvidersService } from './providers.service';
import { AbnVerificationService } from './abn-verification.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { UpdateServiceAreaDto } from './dto/update-service-area.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly abnService: AbnVerificationService,
  ) {}

  @Post('onboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create provider profile (onboarding)' })
  @ApiResponse({ status: 201, description: 'Provider profile created' })
  @ApiResponse({ status: 409, description: 'Provider profile already exists' })
  async createProvider(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateProviderDto,
  ) {
    return this.providersService.createProvider(user.id, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current provider profile' })
  @ApiResponse({ status: 200, description: 'Provider profile retrieved' })
  @ApiResponse({ status: 404, description: 'Provider profile not found' })
  async getMyProfile(@CurrentUser() user: CurrentUserData) {
    return this.providersService.getProviderByUserId(user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider profile' })
  @ApiResponse({ status: 200, description: 'Provider profile updated' })
  async updateMyProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateProviderDto,
  ) {
    return this.providersService.updateProvider(user.id, dto);
  }

  @Patch('me/service-area')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider service area' })
  @ApiResponse({ status: 200, description: 'Service area updated' })
  async updateServiceArea(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateServiceAreaDto,
  ) {
    return this.providersService.updateServiceArea(user.id, dto);
  }

  @Patch('me/banking')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update banking details for payouts' })
  @ApiResponse({ status: 200, description: 'Banking details updated' })
  async updateBanking(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateBankingDto,
  ) {
    return this.providersService.updateBanking(user.id, dto);
  }

  @Post('me/verify-abn')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify ABN with Australian Business Register' })
  @ApiResponse({ status: 200, description: 'ABN verification result' })
  @ApiResponse({ status: 400, description: 'Invalid ABN format' })
  async verifyAbn(@CurrentUser() user: CurrentUserData) {
    const provider = await this.providersService.getProviderByUserId(user.id);
    return this.abnService.verifyAndUpdateProvider(user.id, provider.abn);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('provider')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider statistics' })
  @ApiResponse({ status: 200, description: 'Provider stats retrieved' })
  async getMyStats(@CurrentUser() user: CurrentUserData) {
    const provider = await this.providersService.getProviderByUserId(user.id);
    return this.providersService.getProviderStats(provider.id);
  }

  // Public endpoints for searching providers

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Search for providers' })
  @ApiQuery({ name: 'serviceType', required: false, enum: ['domestic_cleaning', 'community_transport', 'yard_maintenance'] })
  @ApiQuery({ name: 'state', required: false, enum: ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'NT', 'TAS', 'ACT'] })
  @ApiQuery({ name: 'postcode', required: false })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Providers list' })
  async searchProviders(
    @Query('serviceType') serviceType?: string,
    @Query('state') state?: string,
    @Query('postcode') postcode?: string,
    @Query('minRating') minRating?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.providersService.searchProviders({
      serviceType,
      state,
      postcode,
      minRating,
      page,
      limit,
    });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get provider by ID' })
  @ApiResponse({ status: 200, description: 'Provider details' })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  async getProviderById(@Param('id') id: string) {
    return this.providersService.getProviderById(id);
  }
}
