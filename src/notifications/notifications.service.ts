import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { GenericCrudService } from 'src/common/services/generic-crud.service';
import { isAdmin } from 'src/common/utils/is-role-functions';
import { CustomLoggerService } from 'src/logger/custom-logger.service';
import { User } from 'src/users/users/entities/user.entity';
import { Connection, EntityManager, SelectQueryBuilder } from 'typeorm';
import { PartialUpdateNotificationDto } from './dtos/partial-update-notification.dto';
import { NotificationType } from './entities/notification-type.entity';
import { Notification } from './entities/notification.entity';
import { ENotificationType } from './enums/e-notification-type.enum';
import { NotificationsRepository } from './notifications.repository';
import { RegistrationToken } from './registration-tokens/entities/registration-token.entity';
import { RegistrationTokensService } from './registration-tokens/registration-tokens.service';

@Injectable()
export class NotificationsService extends GenericCrudService<Notification> {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly logger: CustomLoggerService,
    private readonly registrationTokensService: RegistrationTokensService,
  ) {
    super(Notification);
    this.createNotificationTypes(connection.manager);
  }

  // TODO: Delete this method in production
  private async createNotificationTypes(manager: EntityManager) {
    const notificationTypesRepository = this.getNotificationTypesRepository(manager);

    if (!(await notificationTypesRepository.count())) {
      return notificationTypesRepository.save([
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

  //* findAll
  protected addExtraClauses(queryBuilder: SelectQueryBuilder<Notification>, user?: UserIdentity) {
    queryBuilder.innerJoinAndSelect(`${queryBuilder.alias}.type`, 'type');

    //* /notifications/me
    if (user) {
      queryBuilder.andWhere('user_id = :userId', { userId: user.id });
    }

    return queryBuilder;
  }

  //* findById
  protected async checkFindByIdConditions(notification: Notification, _manager: EntityManager, user: UserIdentity) {
    this.userCanAccessNotification(notification, user);
  }

  //! Implemented to avoid creation of notifications by error by other developers
  async create(): Promise<Notification> {
    throw new Error('Method not implemented.');
  }

  //* update
  protected async checkUpdateConditions(
    _updateNotificationDto: PartialUpdateNotificationDto,
    notification: Notification,
    _manager: EntityManager,
    user: UserIdentity,
  ) {
    this.userCanAccessNotification(notification, user);
  }

  //* delete
  protected async checkDeleteConditions(notification: Notification, manager: EntityManager, user: UserIdentity) {
    this.userCanAccessNotification(notification, user);
  }

  private userCanAccessNotification(notification: Notification, user: UserIdentity) {
    if (!isAdmin(user) && !this.isNotificationFromUser(user.id, notification)) {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  private isNotificationFromUser(userId: string, notification: Notification) {
    return userId === notification.userId;
  }

  // TODO: Define if all logic should be in a unique method (general handler) or it's convenient to split
  // TODO: logic in N methods and then channel everything in a final "send" method
  // TODO: The principal problem is the variability of parameters regarding the type of notification in place
  async sendNotification(userId: string, type: ENotificationType, manager: EntityManager) {
    // TODO: Retrieve all user information that would be useful

    const notificationTypesRepository = this.getNotificationTypesRepository(manager);
    const notificationType = await notificationTypesRepository.findOne({ where: { code: type } });
    const registrationToken = await this.registrationTokensService.findById(userId, manager);
    const message = this.buildMessage(notificationType, registrationToken);

    // Send message to the device corresponding to the registration token provided.
    try {
      const messageId = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${messageId}`);

      const notificationsRepository = this.getNotificationsRepository(manager);
      return notificationsRepository.saveAndReload({
        ...message.notification,
        messageId,
        user: new User({ id: userId }),
        type: notificationType,
      });
    } catch (error) {
      // TODO: Handle error
      // handleFirebaseError(error)
    }
  }

  private buildMessage(
    notificationType: NotificationType,
    registrationToken: RegistrationToken,
  ): admin.messaging.Message {
    return {
      notification: {
        title: notificationType.titleTemplate,
        body: notificationType.bodyTemplate,
        imageUrl: notificationType.imageUrlTemplate,
      },
      data: JSON.parse(notificationType.dataTemplate),
      token: registrationToken.token,
    };
  }

  private getNotificationsRepository(manager: EntityManager) {
    return manager.getCustomRepository(NotificationsRepository);
  }

  private getNotificationTypesRepository(manager: EntityManager) {
    return manager.getRepository(NotificationType);
  }

  protected throwCustomNotFoundException(id: string) {
    throw new NotFoundException(`Notificación ${id} no encontrada.`);
  }
}
