import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { CrudService } from '../interfaces/crud-service.interface';
import { GenericInterface } from '../interfaces/generic.interface';
import { Order } from '../interfaces/order.type';
import { RemoveOptions } from '../interfaces/remove-options.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { Where } from '../interfaces/where.type';

export class ProxyCrudService<T extends BaseEntity> implements CrudService<T> {
  constructor(private readonly connection: Connection, private readonly service: CrudService<T>) {}

  findAll(
    options: IPaginationOptions,
    where: Where,
    order: Order<T>,
    _manager: EntityManager,
    user?: UserIdentity,
    parentCollectionIds?: GenericInterface,
  ) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.findAll(options, where, order, manager, user, parentCollectionIds);
    });
  }

  findOne(id: string, _manager: EntityManager, user?: UserIdentity, parentCollectionIds?: GenericInterface) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.findOne(id, manager, user, parentCollectionIds);
    });
  }

  create(createDto: DeepPartial<T>, _manager: EntityManager, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.create(createDto, manager, user);
    });
  }

  update(id: string, updateDto: DeepPartial<T>, _manager: EntityManager, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.update(id, updateDto, manager, user);
    });
  }

  remove(id: string, options?: RemoveOptions, _manager?: EntityManager, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.remove(id, options, manager, user);
    });
  }
}
