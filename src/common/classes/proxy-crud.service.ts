import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { CrudService } from '../interfaces/crud-service.interface';

export class ProxyCrudService<T> implements CrudService<T> {
  constructor(private readonly connection: Connection, private readonly service: CrudService<T>) {}

  findAll(options: IPaginationOptions) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.findAll(options, manager);
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
