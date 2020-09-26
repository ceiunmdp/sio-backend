import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { CrudService } from '../interfaces/crud-service.interface';
import { Order } from '../interfaces/order.type';
import { RemoveOptions } from '../interfaces/remove-options.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { Where } from '../interfaces/where.type';

export class ProxyCrudService<T extends BaseEntity> implements CrudService<T> {
  constructor(private readonly connection: Connection, private readonly service: CrudService<T>) {}

  findAll(options: IPaginationOptions, where: Where, order: Order<T>, _, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findAll(options, where, order, manager, user);
    });
  }

  findById(id: string, _, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findById(id, manager, user);
    });
  }

  create(createDto: DeepPartial<T>, _, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.create(createDto, manager, user);
    });
  }

  update(id: string, updateDto: DeepPartial<T>, _, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.update(id, updateDto, manager, user);
    });
  }

  delete(id: string, options?: RemoveOptions, _?, user?: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.delete(id, options, manager, user);
    });
  }
}