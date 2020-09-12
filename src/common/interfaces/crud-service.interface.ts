import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { Order } from './order.type';
import { RemoveOptions } from './remove-options.interface';
import { UserIdentity } from './user-identity.interface';
import { Where } from './where.type';

export interface CrudService<T extends BaseEntity> {
  findAll(
    options: IPaginationOptions,
    where: Where,
    order: Order<T>,
    manager?: EntityManager,
    user?: UserIdentity,
  ): Promise<Pagination<T>>;
  findById(id: string, manager?: EntityManager, user?: UserIdentity): Promise<T>;
  create(createDto: DeepPartial<T>, manager?: EntityManager, user?: UserIdentity): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>, manager?: EntityManager, user?: UserIdentity): Promise<T>;
  delete(id: string, options?: RemoveOptions, manager?: EntityManager, user?: UserIdentity): Promise<void>;
}
