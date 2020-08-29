import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exists.exception';
import { CrudService } from 'src/common/interfaces/crud-service.interface';
import { DeepPartial, EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UserMerger } from './merger.class';

@Injectable()
export abstract class GenericSubUserService<T extends User> implements CrudService<T> {
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

    try {
      const subUser = await subUserRepository.save(createDto);
      const user = await this.usersService.create(subUser.id, createDto, manager);
      return this.userMerger.mergeSubUser(user, subUser);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsException) {
        throw new ConflictException(`Ya existe un usuario con el email elegido.`);
      } else {
        throw error;
      }
    }
  }

  async update<U extends DeepPartial<T>>(id: string, updateDto: U, manager: EntityManager) {
    const subUsersRepository = manager.getRepository<T>(this.type);

    const subUser = await subUsersRepository.findOne(id);
    if (subUser) {
      try {
        const updatedSubUser = await subUsersRepository.save({ ...updateDto, id });
        const user = await this.usersService.update(id, updateDto, manager);
        return this.userMerger.mergeSubUser(user, updatedSubUser);
      } catch (error) {
        if (error instanceof EmailAlreadyExistsException) {
          throw new BadRequestException('El email elegido ya se encuentra en uso por otro usuario.');
        } else {
          throw error;
        }
      }
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
      await this.usersService.delete(id);
      return;
    } else {
      throw new NotFoundException(`Usuario ${this.type.name} ${id} no encontrado.`);
    }
  }
}
