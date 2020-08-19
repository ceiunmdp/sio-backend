import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { Repository } from 'typeorm';
import { NotificationType } from './entities/notification-type.entity';
import { ENotificationType } from './enums/e-notification-type.enum';
import { NotificationRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly notificationsRepository: NotificationRepository,
    @InjectRepository(NotificationType) private readonly notificationTypesRepository: Repository<NotificationType>,
  ) {}

  // TODO: Define if all logic should be in a unique method (general handler) or it's convenient to split
  // TODO: logic in N methods and then channel everything in a final "send" method
  // TODO: The principal problem is the variability of parameters regarding the type of notification in place
  async sendNotification(userId: string, type: ENotificationType) {
    // TODO: Retrieve all user information that would be useful

    // TODO: Retrieve registration token
    const registrationToken = 'registration_token';

    const message: admin.messaging.Message = {
      notification: {
        title: 'Title',
        body: 'Body',
        imageUrl: 'Image URL',
      },
      data: {
        key: 'value',
      },
      token: registrationToken,
    };

    // Send a message to the device corresponding to the provided registration token.
    try {
      const messageId = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${messageId}`);
    } catch (error) {
      const firebaseError = error as admin.FirebaseError;
      this.logger.error(`Error sending message.\nCode: ${firebaseError.code}\nMessage: ${firebaseError.message}`);
    }

    // TODO: Save notification in database
    return;
  }
}
