/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import camelcase from 'camelcase';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DeepPartial, EntityManager, SelectQueryBuilder } from 'typeorm';
import { BaseEntity } from '../base-classes/base-entity.entity';
import { CrudService } from '../interfaces/crud-service.interface';
import { GenericInterface } from '../interfaces/generic.interface';
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
    parentCollectionIds?: GenericInterface,
  ) {
    const entitiesRepository = this.getRepository(manager);
    let queryBuilder = filterQuery<T>(entitiesRepository.createQueryBuilder(camelcase(this.type.name)), where);
    queryBuilder = this.addExtraClauses(queryBuilder, user, parentCollectionIds);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    return paginate<T>(queryBuilder, options);
  }

  protected addExtraClauses(
    queryBuilder: SelectQueryBuilder<T>,
    _user: UserIdentity,
    _parentCollectionIds?: GenericInterface,
  ) {
    return queryBuilder;
  }

  protected addOrderByClausesToQueryBuilder<T>(qb: SelectQueryBuilder<T>, order: Order<T>) {
    if (order) {
      Object.keys(order).map((property) => {
        qb.addOrderBy(property, order[property]);
      });
    }

    return qb;
  }

  async findOne(id: string, manager: EntityManager, user?: UserIdentity) {
    const entity = await this.getRepository(manager).findOne(id, {
      relations: this.getFindOneRelations(),
      loadEagerRelations: true,
    });

    if (entity) {
      await this.checkFindOneConditions(entity, manager, user);
      return entity;
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  protected async checkFindOneConditions(_entity: T, _manager?: EntityManager, _user?: UserIdentity) {
    return;
  }

  async create(createDto: DeepPartial<T>, manager: EntityManager, _user: UserIdentity) {
    const entitiesRepository = this.getRepository(manager);

    const newEntity = await entitiesRepository.save(createDto);

    // TODO: Call this.findOne() instead of repository method, 'user' property is the problem
    return entitiesRepository.findOne(newEntity.id, {
      relations: this.getFindOneRelations(),
      loadEagerRelations: true,
    });
  }

  async update(id: string, updateDto: DeepPartial<T>, manager: EntityManager, user: UserIdentity) {
    const entity = await this.findOne(id, manager, user);

    await this.checkUpdateConditions(updateDto, entity, manager, user);

    await this.getRepository(manager).save({ ...updateDto, id });
    return this.findOne(id, manager, user);
  }

  protected async checkUpdateConditions(
    _updateDto: DeepPartial<T>,
    _entity: T,
    _manager?: EntityManager,
    _user?: UserIdentity,
  ) {
    return;
  }

  async remove(id: string, options: RemoveOptions, manager: EntityManager, user: UserIdentity) {
    const entity = await this.findOne(id, manager, user);

    await this.checkRemoveConditions(entity, manager, user);
    await this.beforeRemove(entity, manager, user);

    const entitiesRepository = this.getRepository(manager);
    options?.softRemove
      ? await entitiesRepository.softRemove(entity as unknown as DeepPartial<T>)
      : await entitiesRepository.remove(entity);
    return;
  }

  protected async checkRemoveConditions(_entity: T, _manager?: EntityManager, _user?: UserIdentity) {
    return;
  }

  protected async beforeRemove(_entity: T, _manager?: EntityManager, _user?: UserIdentity) {
    return;
  }

  private getRepository(manager: EntityManager) {
    return manager.getRepository<T>(this.type);
  }

  protected getFindOneRelations(): string[] {
    return [];
  }

  protected abstract throwCustomNotFoundException(id: string): void;
}
