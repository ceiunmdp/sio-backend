import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { Connection, EntityManager } from 'typeorm';
import { NotificationType } from './entities/notification-type.entity';
import { ENotificationType } from './enums/e-notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(@InjectConnection() connection: Connection, private readonly logger: CustomLoggerService) {
    this.createNotificationTypes(connection.manager);
  }

  // TODO: Delete this method in production
  private async createNotificationTypes(manager: EntityManager) {
    const notificationTypesRepository = manager.getRepository(NotificationType);

    if (!(await notificationTypesRepository.count())) {
      notificationTypesRepository.save([
        new NotificationType({
          name: 'Copias disponibles restauradas',
          code: ENotificationType.AVAILABLE_COPIES_RESTORED,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Degradación a estudiante',
          code: ENotificationType.DEGRADATION_TO_STUDENT,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Transferencia entrante',
          code: ENotificationType.INCOMING_TRANSFER,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Pedido cancelado',
          code: ENotificationType.ORDER_CANCELLED,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Pedido entregado',
          code: ENotificationType.ORDER_DELIVERED,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Pedido en proceso',
          code: ENotificationType.ORDER_IN_PROCESS,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Pedido listo para retirar',
          code: ENotificationType.ORDER_READY,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Pedido desacreditado',
          code: ENotificationType.ORDER_UNDELIVERED,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Promoción a becado',
          code: ENotificationType.PROMOTION_TO_SCHOLARSHIP,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
        new NotificationType({
          name: 'Carga de saldo',
          code: ENotificationType.TOP_UP,
          titleTemplate: '',
          bodyTemplate: '',
          imageUrlTemplate: '',
          dataTemplate: '',
        }),
      ]);
    }
  }

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

    // Send a message to the device corresponding with the provided registration token.
    try {
      const messageId = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${messageId}`);
    } catch (error) {
      // TODO: Hahdle error
      // handleFirebaseError(error)
    }

    // TODO: Save notification in database
    return;
  }
}
