import { Body, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/typeorm';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Filter } from 'src/common/decorators/filter.decorator';
import { Id } from 'src/common/decorators/id.decorator';
import { DeleteById } from 'src/common/decorators/methods/delete-by-id.decorator';
import { GetAll } from 'src/common/decorators/methods/get-all.decorator';
import { GetById } from 'src/common/decorators/methods/get-by-id.decorator';
import { PatchById } from 'src/common/decorators/methods/patch-by-id.decorator';
import { PutById } from 'src/common/decorators/methods/put-by-id.decorator';
import { Limit, Page } from 'src/common/decorators/pagination.decorator';
import { Sort } from 'src/common/decorators/sort.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Collection } from 'src/common/enums/collection.enum';
import { Path } from 'src/common/enums/path.enum';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { ProxyCrudService } from 'src/common/services/proxy-crud.service';
import { AppConfigService } from 'src/config/app/app-config.service';
import { Connection } from 'typeorm';
import { PartialUpdateNotificationDto } from './dtos/partial-update-notification.dto';
import { ResponseNotificationDto } from './dtos/response-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller()
export class NotificationsController {
  private readonly notificationsService: CrudService<Notification>;

  constructor(
    @InjectConnection() connection: Connection,
    private readonly appConfigService: AppConfigService,
    notificationsService: NotificationsService,
  ) {
    this.notificationsService = new ProxyCrudService(connection, notificationsService);
  }

  @GetAll(Collection.NOTIFICATIONS, ResponseNotificationDto)
  @Auth(UserRole.ADMIN)
  async findAll(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<Notification>,
  ) {
    return this.notificationsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.NOTIFICATIONS}`,
      },
      where,
      order,
    );
  }

  @GetAll(Collection.NOTIFICATIONS, ResponseNotificationDto, Path.ME)
  @Auth(...ALL_ROLES)
  async findAllOwn(
    @Limit() limit: number,
    @Page() page: number,
    @Filter() where: Where,
    @Sort() order: Order<Notification>,
    @User() user: UserIdentity,
  ) {
    return this.notificationsService.findAll(
      {
        limit,
        page,
        route: `${this.appConfigService.basePath}${Path.NOTIFICATIONS}${Path.ME}`,
      },
      where,
      order,
      undefined,
      user,
    );
  }

  @GetById(Collection.NOTIFICATIONS, ResponseNotificationDto)
  @Auth(...ALL_ROLES)
  async findById(@Id() id: string, @User() user: UserIdentity) {
    return this.notificationsService.findById(id, undefined, user);
  }

  @PutById(Collection.NOTIFICATIONS, ResponseNotificationDto)
  @Auth(...ALL_ROLES)
  async update(@Id() id: string, @Body() updateNotificationDto: UpdateNotificationDto, @User() user: UserIdentity) {
    return this.notificationsService.update(id, updateNotificationDto, undefined, user);
  }

  @PatchById(Collection.NOTIFICATIONS, ResponseNotificationDto)
  @Auth(...ALL_ROLES)
  async partialUpdate(
    @Id() id: string,
    @Body() partialUpdateNotificationDto: PartialUpdateNotificationDto,
    @User() user: UserIdentity,
  ) {
    return this.notificationsService.update(id, partialUpdateNotificationDto, undefined, user);
  }

  @DeleteById(Collection.NOTIFICATIONS)
  @Auth(...ALL_ROLES)
  async delete(@Id() id: string, @User() user: UserIdentity) {
    return this.notificationsService.delete(id, { softRemove: false }, undefined, user);
  }
}
