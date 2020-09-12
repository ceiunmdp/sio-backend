/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { CrudService } from '../interfaces/crud-service.interface';
import { Order } from '../interfaces/order.type';
import { RemoveOptions } from '../interfaces/remove-options.interface';
import { UserIdentity } from '../interfaces/user-identity.interface';
import { Where } from '../interfaces/where.type';
import { filterQuery } from '../utils/query-builder';

@Injectable()
export abstract class GenericCrudService<T extends BaseEntity> implements CrudService<T> {
  constructor(private readonly type: new (partial: Partial<T>) => T) {}

  async findAll(
    options: IPaginationOptions,
    where: Where,
    order: Order<T>,
    manager: EntityManager,
    user: UserIdentity,
  ) {
    const entitiesRepository = manager.getRepository<T>(this.type);
    let queryBuilder = filterQuery<T>(entitiesRepository.createQueryBuilder(), where);
    queryBuilder = this.addExtraClauses(queryBuilder, user);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    return paginate<T>(queryBuilder, options);
  }

  protected addExtraClauses(queryBuilder: SelectQueryBuilder<T>, _user: UserIdentity) {
    return queryBuilder;
  }

  addOrderByClausesToQueryBuilder<T>(qb: SelectQueryBuilder<T>, order: Order<T>) {
    Object.keys(order).map((property) => {
      qb.addOrderBy(property, order[property]);
    });
    return qb;
  }

  async findById(id: string, manager: EntityManager, _user: UserIdentity) {
    const entity = await manager.getRepository<T>(this.type).findOne(id);

    if (entity) {
      return entity;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  async create(createDto: DeepPartial<T>, manager: EntityManager, _user: UserIdentity) {
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
