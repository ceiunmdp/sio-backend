import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { PaginationOptions } from 'src/users/users/users.service';
import { DeepPartial, EntityManager } from 'typeorm';

export interface CrudService<T> {
  findAll(options: IPaginationOptions | PaginationOptions, manager: EntityManager): Promise<Pagination<T>>;
  findById(id: string, manager: EntityManager): Promise<T>;

  // create(createDto: Required<T>, manager: EntityManager): Promise<T>;
  create(createDto: DeepPartial<T>, manager: EntityManager): Promise<T>;
  // create(createDto: DeepRequired<T>, manager: EntityManager): Promise<T>;

  // update(id: string, updateDto: Required<T>, manager: EntityManager): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>, manager: EntityManager): Promise<T>;

  delete(id: string, manager: EntityManager): Promise<void>;
}
