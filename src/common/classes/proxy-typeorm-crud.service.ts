import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationOptions } from 'src/users/users/users.service';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { TypeOrmCrudService } from '../interfaces/typeorm-crud-service.interface';

export class ProxyTypeOrmCrudService<T> implements TypeOrmCrudService<T> {
  constructor(private readonly connection: Connection, private readonly service: TypeOrmCrudService<T>) {}

  findAll(options: IPaginationOptions | PaginationOptions): Promise<Pagination<T>> {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findAll(options, manager);
    });
  }

  findById(id: string): Promise<T> {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findById(id, manager);
    });
  }

  create(createDto: DeepPartial<T>): Promise<T> {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.create(createDto, manager);
    });
  }

  update(id: string, updateDto: DeepPartial<T>): Promise<T> {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.update(id, updateDto, manager);
    });
  }

  delete(id: string): Promise<void> {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.delete(id, manager);
    });
  }
}
