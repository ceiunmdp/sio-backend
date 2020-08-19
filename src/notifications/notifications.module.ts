import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationType } from './entities/notification-type.entity';
import { Notification } from './entities/notification.entity';
import { RegistrationToken } from './entities/registration-token.entity';
import { NotificationRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationType, RegistrationToken, NotificationRepository])],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
