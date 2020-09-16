import { AutoMapper, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { ResponseNotificationTypeDto } from '../dtos/response-notification-type.dto';
import { ResponseNotificationDto } from '../dtos/response-notification.dto';
import { NotificationType } from '../entities/notification-type.entity';
import { Notification } from '../entities/notification.entity';

@Profile()
export class NotificationProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromNotificationToResponseNotificationDto(mapper);
    mapper.createMap(NotificationType, ResponseNotificationTypeDto, {
      includeBase: [BaseEntity, ResponseBaseEntityDto],
    });
  }

  createMapFromNotificationToResponseNotificationDto(mapper: AutoMapper) {
    mapper
      .createMap(Notification, ResponseNotificationDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] })
      .forMember(
        (responseNotificationDto) => responseNotificationDto.user,
        mapDefer((notification) =>
          notification.user
            ? mapWith(ResponseUserDto, (notification) => notification.user)
            : mapFrom((notification) => ({ id: notification.userId })),
        ),
      );
  }
}
