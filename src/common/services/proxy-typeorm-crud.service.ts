import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PaginationOptions } from 'src/users/users/users.service';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { Order } from '../interfaces/order.type';
import { TypeOrmCrudService } from '../interfaces/typeorm-crud-service.interface';
import { Where } from '../interfaces/where.type';

export class ProxyTypeOrmCrudService<T> implements TypeOrmCrudService<T> {
  constructor(private readonly connection: Connection, private readonly service: TypeOrmCrudService<T>) {}

  findAll(options: IPaginationOptions | PaginationOptions, where: Where, order: Order<T>) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findAll(options, where, order, manager);
    });
  }

  findById(id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findById(id, manager);
    });
  }

  create(createDto: DeepPartial<T>) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.create(createDto, manager);
    });
  }

  update(id: string, updateDto: DeepPartial<T>) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.update(id, updateDto, manager);
    });
  }

  delete(id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.delete(id, manager);
    });
  }
}
