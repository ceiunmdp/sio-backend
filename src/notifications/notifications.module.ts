import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { SharedModule } from 'src/shared/shared.module';
import { NotificationType } from './entities/notification-type.entity';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';
//! Profiles
import './profiles/notification.profile';
import { RegistrationTokensModule } from './registration-tokens/registration-tokens.module';

@Module({
  imports: [
    SharedModule,
    AppConfigModule,
    RegistrationTokensModule,
    TypeOrmModule.forFeature([Notification, NotificationType, NotificationsRepository]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
