import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationType } from './entities/notification-type.entity';
import { Notification } from './entities/notification.entity';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';
import { RegistrationTokensModule } from './registration-tokens/registration-tokens.module';

@Module({
  imports: [
    RegistrationTokensModule,
    TypeOrmModule.forFeature([Notification, NotificationType, NotificationsRepository]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
