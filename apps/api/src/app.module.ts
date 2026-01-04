import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { CoordinatorsModule } from './modules/coordinators/coordinators.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthController } from './common/health/health.controller';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ParticipantsModule,
    ProvidersModule,
    CoordinatorsModule,
    BookingsModule,
    InvoicesModule,
    DocumentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
