import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { GenericInterface } from './generic.interface';
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
    parentCollectionIds?: GenericInterface,
  ): Promise<Pagination<T>>;
  findOne(id: string, manager?: EntityManager, user?: UserIdentity, parentCollectionIds?: GenericInterface): Promise<T>;
  create(createDto: DeepPartial<T>, manager?: EntityManager, user?: UserIdentity): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>, manager?: EntityManager, user?: UserIdentity): Promise<T>;
  remove(id: string, options?: RemoveOptions, manager?: EntityManager, user?: UserIdentity): Promise<void>;
}
