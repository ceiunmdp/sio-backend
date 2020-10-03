import { ForbiddenException, Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Order } from 'src/common/interfaces/order.type';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { UserIdentity } from 'src/common/interfaces/user-identity.interface';
import { Where } from 'src/common/interfaces/where.type';
import { isAdmin } from 'src/common/utils/is-role-functions';
import { filterQuery } from 'src/common/utils/query-builder';
import { DeepPartial, EntityManager, SelectQueryBuilder } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserMerger } from './merger.class';

@Injectable()
export abstract class GenericSubUserService<T extends User> implements TypeOrmCrudService<T> {
  protected userMerger: UserMerger<T>;

  constructor(protected readonly usersService: UsersService, private readonly type: new (partial: Partial<T>) => T) {
    this.userMerger = new UserMerger(usersService, type);
  }

  async findAll(options: IPaginationOptions, where: Where, order: Order<T>, manager: EntityManager) {
    const entitiesRepository = manager.getRepository<T>(this.type);
    let queryBuilder = filterQuery<T>(entitiesRepository.createQueryBuilder(), where);
    queryBuilder = this.addOrderByClausesToQueryBuilder(queryBuilder, order);
    const { items, meta, links } = await paginate<T>(queryBuilder, options);
    return new Pagination<T>(await this.userMerger.findAndMergeSubUsers(items, manager), meta, links);
  }

  protected addOrderByClausesToQueryBuilder<T>(qb: SelectQueryBuilder<T>, order: Order<T>) {
    Object.keys(order).map((property) => {
      qb.addOrderBy(property, order[property]);
    });
    return qb;
  }

  async findOne(id: string, manager: EntityManager, user: UserIdentity) {
    if (isAdmin(user) || id === user.id) {
      const subUser = await manager.getRepository<T>(this.type).findOne(id);

      if (subUser) {
        return this.userMerger.findAndMergeSubUser(subUser, manager);
      } else {
        this.throwCustomNotFoundException(id);
      }
    } else {
      throw new ForbiddenException('Prohibido el acceso al recurso.');
    }
  }

  async create(createDto: DeepPartial<T>, manager: EntityManager) {
    const subUserRepository = manager.getRepository<T>(this.type);

    const newSubUser = await subUserRepository.save(createDto);

    //* Copy 'id' to 'uid' after saving entity
    await subUserRepository.save({ ...newSubUser, uid: newSubUser.id });

    createDto.uid = newSubUser.id;
    const user = await this.usersService.create(createDto, manager);

    return this.userMerger.mergeSubUser(user, newSubUser);
  }

  async update(id: string, updateDto: DeepPartial<T>, manager: EntityManager) {
    const subUsersRepository = manager.getRepository<T>(this.type);

    const subUser = await subUsersRepository.findOne(id);
    if (subUser) {
      const updatedSubUser = await subUsersRepository.save({ ...updateDto, id });
      const user = await this.usersService.update(id, updateDto, manager);
      return this.userMerger.mergeSubUser(user, updatedSubUser);
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  async remove(id: string, manager: EntityManager) {
    const subUsersRepository = manager.getRepository<T>(this.type);

    const subUser = await subUsersRepository.findOne(id);
    if (subUser) {
      await this.beforeRemove(subUser, manager);
      await this.usersService.remove(id, manager);
      await subUsersRepository.remove(subUser);
      return;
    } else {
      this.throwCustomNotFoundException(id);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async beforeRemove(_subUser: T, _manager: EntityManager) {
    return;
  }

  protected abstract throwCustomNotFoundException(id: string): void;
}
