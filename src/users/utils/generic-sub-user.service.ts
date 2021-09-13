/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { Order } from 'src/common/interfaces/order.type';
import { RemoveOptions } from 'src/common/interfaces/remove-options.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { filterQuery } from 'src/common/utils/query-builder';
import { DeepPartial, EntityManager, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserMerger } from './merger.class';

@Injectable()
export abstract class GenericSubUserService<T extends User> implements CrudService<T> {
  protected userMerger: UserMerger<T>;

  constructor(protected readonly usersService: UsersService, private readonly type: new (partial: Partial<T>) => T) {
    this.userMerger = new UserMerger(usersService, type);
  }

  async findAll(options: IPaginationOptions, where: Where, order: Order<T>, manager: EntityManager) {
    const entitiesRepository = this.getRepository(manager);
    let queryBuilder = filterQuery<T>(entitiesRepository.createQueryBuilder(), where);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    const { items: subUsers, meta, links } = await paginate<T>(queryBuilder, options);
    return new Pagination<T>(await this.userMerger.findAndMergeSubUsers(subUsers, manager), meta, links);
  }

  protected addOrderByClausesToQueryBuilder<T>(qb: SelectQueryBuilder<T>, order: Order<T>) {
    Object.keys(order).map((property) => {
      qb.addOrderBy(property, order[property]);
    });

    return qb;
  }

  async findOne(id: string, manager: EntityManager, user?: UserIdentity) {
    const subUser = await this.getRepository(manager).findOne(id, {
      relations: this.getFindOneRelations(),
      loadEagerRelations: true,
    });

    if (subUser) {
      await this.checkFindOneConditions(subUser, manager, user);
      return this.userMerger.findAndMergeSubUser(subUser, manager);
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  protected async checkFindOneConditions(_entity: T, _manager: EntityManager, _user?: UserIdentity) {
    return;
  }

  async create(createDto: DeepPartial<T>, manager: EntityManager) {
    const subUserRepository = this.getRepository(manager);

    //! Generate a new object instead of passing the original to avoid being overwritten by the .save() method
    //! Doing this the object will never have 'createdAt' and 'updatedAt' properties that confuses Firebase's library
    const newSubUser = await subUserRepository.save({...createDto});

    //* Copy 'id' to 'uid' after saving entity
    await subUserRepository.save({ ...newSubUser, uid: newSubUser.id });

    createDto.uid = newSubUser.id;
    const user = await this.usersService.create(createDto, manager);

    return this.userMerger.mergeSubUser(user, newSubUser);
  }

  async update(id: string, updateDto: DeepPartial<T>, manager: EntityManager, userIdentity: UserIdentity) {
    const subUser = await this.findOne(id, manager, userIdentity);

    await this.checkUpdateConditions(updateDto, subUser, manager, userIdentity);

    const user = await this.usersService.update(id, updateDto, manager, userIdentity);
    const updatedSubUser = await this.getRepository(manager).save({ ...updateDto, id });

    return this.userMerger.mergeSubUser(user, updatedSubUser);
  }

  protected async checkUpdateConditions(
    _updateDto: DeepPartial<T>,
    _entity: T,
    _manager: EntityManager,
    _user?: UserIdentity,
  ) {
    return;
  }

  async remove(id: string, options: RemoveOptions, manager: EntityManager, user?: UserIdentity) {
    const usersRepository = this.getRepository(manager);
    const subUser = await this.findOne(id, manager, user);

    await this.beforeRemove(subUser, manager);

    if (options.softRemove) {
      await usersRepository.softRemove(subUser as unknown as DeepPartial<T>);
    } else {
      await this.usersService.remove(id, { softRemove: false }, manager);
      await usersRepository.remove(subUser);
    }

    return;
  }

  protected async beforeRemove(_subUser: T, _manager: EntityManager) {
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
