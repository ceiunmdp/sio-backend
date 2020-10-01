import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationOptions } from 'src/users/users/users.service';
import { DeepPartial, EntityManager } from 'typeorm';
import { Order } from './order.type';
import { UserIdentity } from './user-identity.interface';
import { Where } from './where.type';

export interface TypeOrmCrudService<T> {
  findAll(
    options: IPaginationOptions | PaginationOptions,
    where: Where,
    order: Order<T>,
    manager?: EntityManager,
  ): Promise<Pagination<T>>;
  findOne(id: string, manager?: EntityManager, user?: UserIdentity): Promise<T>;
  create(createDto: DeepPartial<T>, manager?: EntityManager): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>, manager?: EntityManager): Promise<T>;
  remove(id: string, manager?: EntityManager): Promise<void>;
}
