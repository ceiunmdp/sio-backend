import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { TypeOrmCrudService } from 'src/common/interfaces/typeorm-crud-service.interface';
import { DeepPartial, EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserMerger } from './merger.class';

@Injectable()
export abstract class GenericSubUserService<T extends User> implements TypeOrmCrudService<T> {
  protected userMerger: UserMerger<T>;

  constructor(protected readonly usersService: UsersService, private readonly type: new (partial: Partial<T>) => T) {
    this.userMerger = new UserMerger(usersService, type);
  }

  async findAll(options: IPaginationOptions, manager: EntityManager) {
    const { items, meta, links } = await paginate<T>(manager.getRepository<T>(this.type), options);
    return new Pagination<T>(await this.userMerger.findAndMergeSubUsers(items, manager), meta, links);
  }

  async findById(id: string, manager: EntityManager) {
    const subUser = await manager.getRepository<T>(this.type).findOne(id);

    if (subUser) {
      return this.userMerger.findAndMergeSubUser(subUser, manager);
    } else {
      throw new NotFoundException(`Usuario ${this.type.name} ${id} no encontrado.`);
    }
  }

  async create<U extends DeepPartial<T>>(createDto: U, manager: EntityManager) {
    const subUserRepository = manager.getRepository<T>(this.type);

    const newSubUser = await subUserRepository.save(createDto);

    // TODO: Copy 'id' to 'uid' after saving entity
    await subUserRepository.save({ ...newSubUser, uid: newSubUser.id });

    createDto.uid = newSubUser.id;
    const user = await this.usersService.create(createDto, manager);

    return this.userMerger.mergeSubUser(user, newSubUser);
  }

  async update<U extends DeepPartial<T>>(id: string, updateDto: U, manager: EntityManager) {
    const subUsersRepository = manager.getRepository<T>(this.type);

    const subUser = await subUsersRepository.findOne(id);
    if (subUser) {
      const updatedSubUser = await subUsersRepository.save({ ...updateDto, id });
      const user = await this.usersService.update(id, updateDto, manager);
      return this.userMerger.mergeSubUser(user, updatedSubUser);
    } else {
      throw new NotFoundException(`Usuario ${this.type.name} ${id} no encontrado.`);
    }
  }

  async delete(id: string, manager: EntityManager) {
    const subUsersRepository = manager.getRepository<T>(this.type);

    const subUser = await subUsersRepository.findOne(id);
    if (subUser) {
      const id = subUser.id; //* "remove" method erases 'id' property from object
      await subUsersRepository.remove(subUser);
      await this.usersService.delete(id, manager);
      return;
    } else {
      throw new NotFoundException(`Usuario ${this.type.name} ${id} no encontrado.`);
    }
  }
}
