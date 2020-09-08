import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Connection, DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { IsolationLevel } from '../enums/isolation-level.enum';
import { CrudService } from '../interfaces/crud-service.interface';
import { RemoveOptions } from '../interfaces/remove-options.interface';

export class ProxyCrudService<T extends BaseEntity> implements CrudService<T> {
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

  delete(id: string, options?: RemoveOptions) {
    return this.connection.transaction(IsolationLevel.REPEATABLE_READ, async (manager: EntityManager) => {
      return this.service.delete(id, options, manager);
    });
  }
}
