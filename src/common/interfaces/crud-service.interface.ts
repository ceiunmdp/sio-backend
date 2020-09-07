import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager } from 'typeorm';
import { IId } from './id.interface';

export interface CrudService<T> {
  findAll(options: IPaginationOptions, manager?: EntityManager): Promise<Pagination<T>>;
  findById(id: string, manager?: EntityManager): Promise<T>;
  create<U extends DeepPartial<T> & IId>(createDto: U, manager?: EntityManager): Promise<T>;
  update<U extends DeepPartial<T> & IId>(id: string, updateDto: U, manager?: EntityManager): Promise<T>;
  delete(id: string, manager?: EntityManager): Promise<void>;
}
