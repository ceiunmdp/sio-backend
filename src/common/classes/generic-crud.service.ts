import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { CrudService } from '../interfaces/crud-service.interface';
import { RemoveOptions } from '../interfaces/remove-options.interface';

@Injectable()
export abstract class GenericCrudService<T extends BaseEntity> implements CrudService<T> {
  constructor(private readonly type: new (partial: Partial<T>) => T) {}

  async findAll(options: IPaginationOptions, manager: EntityManager) {
    const { items, meta, links } = await paginate<T>(manager.getRepository<T>(this.type), options);
    return new Pagination<T>(items, meta, links);
  }

  async findById(id: string, manager: EntityManager) {
    const entity = await manager.getRepository<T>(this.type).findOne(id);

    if (entity) {
      return entity;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  async create(createDto: DeepPartial<T>, manager: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const newEntity = await entitiesRepository.save(createDto);
    return entitiesRepository.findOne(newEntity.id);
  }

  async update(id: string, updateDto: DeepPartial<T>, manager: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id);
    if (entity) {
      await entitiesRepository.save({ ...updateDto, id });
      return entitiesRepository.findOne(id);
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  async delete(id: string, options?: RemoveOptions, manager?: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id);
    if (entity) {
      options?.softRemove
        ? // TODO: Try to remove 'unknown' casting
          await entitiesRepository.softRemove((entity as unknown) as DeepPartial<T>)
        : await entitiesRepository.remove(entity);
      return;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  protected abstract getCustomMessageNotFoundException(id: string): string;
}
