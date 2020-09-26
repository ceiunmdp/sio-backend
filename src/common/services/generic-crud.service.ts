/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import camelcase from 'camelcase';
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
    user?: UserIdentity,
  ) {
    const entitiesRepository = manager.getRepository<T>(this.type);
    let queryBuilder = filterQuery<T>(entitiesRepository.createQueryBuilder(camelcase(this.type.name)), where);
    queryBuilder = this.addExtraClauses(queryBuilder, user);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    return paginate<T>(queryBuilder, options);
  }

  protected addExtraClauses(queryBuilder: SelectQueryBuilder<T>, _user: UserIdentity) {
    return queryBuilder;
  }

  addOrderByClausesToQueryBuilder<T>(qb: SelectQueryBuilder<T>, order: Order<T>) {
    if (order) {
      Object.keys(order).map((property) => {
        qb.addOrderBy(property, order[property]);
      });
    }

    return qb;
  }

  async findById(id: string, manager: EntityManager, user?: UserIdentity) {
    const entity = await manager
      .getRepository<T>(this.type)
      .findOne(id, { relations: this.getFindOneRelations(), loadEagerRelations: true });

    if (entity) {
      await this.checkFindByIdConditions(entity, manager, user);
      return entity;
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  protected async checkFindByIdConditions(_entity: T, _manager: EntityManager, _user?: UserIdentity) {
    return;
  }

  async create(createDto: DeepPartial<T>, manager: EntityManager, _user?: UserIdentity) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const newEntity = await entitiesRepository.save(createDto);
    return entitiesRepository.findOne(newEntity.id);
  }

  async update(id: string, updateDto: DeepPartial<T>, manager: EntityManager, user?: UserIdentity) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id, { relations: this.getFindOneRelations() });
    if (entity) {
      await this.checkUpdateConditions(updateDto, entity, manager, user);
      await entitiesRepository.save({ ...updateDto, id });
      return entitiesRepository.findOne(id);
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  protected async checkUpdateConditions(
    _updateDto: DeepPartial<T>,
    _entity: T,
    _manager: EntityManager,
    _user?: UserIdentity,
  ) {
    return;
  }

  async delete(id: string, options?: RemoveOptions, manager?: EntityManager, user?: UserIdentity) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id, { relations: this.getFindOneRelations() });
    if (entity) {
      await this.checkDeleteConditions(entity, manager, user);
      await this.beforeDelete(entity, manager, user);
      options?.softRemove
        ? // TODO: Try to remove 'unknown' casting
          await entitiesRepository.softRemove((entity as unknown) as DeepPartial<T>)
        : await entitiesRepository.remove(entity);
      return;
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  protected async checkDeleteConditions(_entity: T, _manager: EntityManager, _user?: UserIdentity) {
    return;
  }

  protected async beforeDelete(_entity: T, _manager: EntityManager, _user?: UserIdentity) {
    return;
  }

  protected getFindOneRelations(): string[] {
    return [];
  }

  protected abstract throwCustomNotFoundException(id: string): void;
}