import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { AbnVerificationService } from './abn-verification.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, AbnVerificationService],
  exports: [ProvidersService, AbnVerificationService],
})
export class ProvidersModule {}
