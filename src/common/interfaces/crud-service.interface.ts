import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { RemoveOptions } from './remove-options.interface';

export interface CrudService<T extends BaseEntity> {
  findAll(options: IPaginationOptions, manager?: EntityManager): Promise<Pagination<T>>;
  findById(id: string, manager?: EntityManager): Promise<T>;
  create(createDto: DeepPartial<T>, manager?: EntityManager): Promise<T>;
  update(id: string, updateDto: DeepPartial<T>, manager?: EntityManager): Promise<T>;
  delete(id: string, options?: RemoveOptions, manager?: EntityManager): Promise<void>;
}
