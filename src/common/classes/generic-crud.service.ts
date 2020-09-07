import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager } from 'typeorm';
import { CrudService } from '../interfaces/crud-service.interface';
import { IId } from '../interfaces/id.interface';

@Injectable()
export abstract class GenericCrudService<T> implements CrudService<T> {
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
      throw new NotFoundException(`${this.type.name} ${id} no encontrado.`);
    }
  }

  async create<U extends DeepPartial<T> & IId>(createDto: U, manager: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const newEntity = await entitiesRepository.save(createDto);
    return entitiesRepository.findOne(newEntity.id);
  }

  async update<U extends DeepPartial<T> & IId>(id: string, updateDto: U, manager: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id);
    if (entity) {
      await entitiesRepository.save({ ...updateDto, id });
      return entitiesRepository.findOne(id);
    } else {
      throw new NotFoundException(`${this.type.name} ${id} no encontrado.`);
    }
  }

  async delete(id: string, manager: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id);
    if (entity) {
      await entitiesRepository.softRemove(entity);
      return;
    } else {
      throw new NotFoundException(`${this.type.name} ${id} no encontrado.`);
    }
  }
}
