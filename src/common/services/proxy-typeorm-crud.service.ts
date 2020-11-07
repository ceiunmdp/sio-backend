import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PaginationOptions } from 'src/users/users/users.service';
import { Connection, DeepPartial } from 'typeorm';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { Order } from '../interfaces/order.type';
import { TypeOrmCrudService } from '../interfaces/typeorm-crud-service.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { Where } from '../interfaces/where.type';

export class ProxyTypeOrmCrudService<T> implements TypeOrmCrudService<T> {
  constructor(private readonly connection: Connection, private readonly service: TypeOrmCrudService<T>) {}

  findAll(options: IPaginationOptions | PaginationOptions, where: Where, order: Order<T>) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.findAll(options, where, order, manager);
    });
  }

  findOne(id: string, _, user: UserIdentity) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.findOne(id, manager, user);
    });
  }

  create(createDto: DeepPartial<T>) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.create(createDto, manager);
    });
  }

  update(id: string, updateDto: DeepPartial<T>) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.update(id, updateDto, manager);
    });
  }

  remove(id: string) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager) => {
      return this.service.remove(id, manager);
    });
  }
}
