import { Injectable, NotFoundException } from '@nestjs/common';
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      this.checkFindByIdConditions(user, entity);
      return entity;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected checkFindByIdConditions(_user: UserIdentity, _entity: T) {
    return;
  }

  protected getFindOneRelations(): string[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(createDto: DeepPartial<T>, manager: EntityManager, _user?: UserIdentity) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const newEntity = await entitiesRepository.save(createDto);
    return entitiesRepository.findOne(newEntity.id);
  }

  async update(id: string, updateDto: DeepPartial<T>, manager: EntityManager, user?: UserIdentity) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id);
    if (entity) {
      this.checkUpdateConditions(user, entity);
      await entitiesRepository.save({ ...updateDto, id });
      return entitiesRepository.findOne(id);
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected checkUpdateConditions(_user: UserIdentity, _entity: T) {
    return;
  }

  async delete(id: string, options?: RemoveOptions, manager?: EntityManager, user?: UserIdentity) {
    const entitiesRepository = manager.getRepository<T>(this.type);

    const entity = await entitiesRepository.findOne(id);
    if (entity) {
      this.checkDeleteConditions(user, entity);
      await this.beforeDelete(user, entity, manager);
      options?.softRemove
        ? // TODO: Try to remove 'unknown' casting
          await entitiesRepository.softRemove((entity as unknown) as DeepPartial<T>)
        : await entitiesRepository.remove(entity);
      return;
    } else {
      throw new NotFoundException(this.getCustomMessageNotFoundException(id));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected checkDeleteConditions(_user: UserIdentity, _entity: T) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async beforeDelete(_user: UserIdentity, _entity: T, _manager: EntityManager) {
    return;
  }

  protected abstract getCustomMessageNotFoundException(id: string);
}
