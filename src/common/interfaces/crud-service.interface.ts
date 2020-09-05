import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { EntityManager } from 'typeorm';

export interface CrudService<T> {
  findAll(options: IPaginationOptions, manager?: EntityManager): Promise<Pagination<T>>;
  findById(id: string, manager?: EntityManager): Promise<T>;
  create(createDto: Required<T>, manager?: EntityManager): Promise<T>;
  update(id: string, updateDto: Required<T>, manager?: EntityManager): Promise<T>;
  delete(id: string, manager?: EntityManager): Promise<void>;
}
