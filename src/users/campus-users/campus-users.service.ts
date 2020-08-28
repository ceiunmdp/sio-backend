import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { EntityManager } from 'typeorm';
import { User } from '../firebase-users/entities/user.entity';
import { FirebaseUsersService } from '../firebase-users/firebase-users.service';
import { CampusUsersRepository } from './campus-users.repository';
import { CreateCampusUserDto } from './dto/create-campus-user.dto';
import { PartialUpdateCampusUserDto } from './dto/partial-update-campus-user.dto';
import { CampusUser } from './entities/campus-user.entity';

@Injectable()
export class CampusUsersService {
  constructor(private readonly firebaseUsersService: FirebaseUsersService) {}

  async findAll(options: IPaginationOptions, manager: EntityManager) {
    const { items, meta, links } = await paginate<CampusUser>(
      manager.getCustomRepository(CampusUsersRepository),
      options,
    );
    return new Pagination<CampusUser>(await this.findAndMergeUsersAndCampusUsers(items, manager), meta, links);
  }

  async findById(id: string, manager: EntityManager) {
    const campusUser = await manager.getCustomRepository(CampusUsersRepository).findOne(id);

    if (campusUser) {
      return this.findAndMergeUserAndCampusUser(campusUser, manager);
    } else {
      throw new NotFoundException(`Usuario sede ${id} no encontrado.`);
    }
  }

  async create(createCampusUserDto: CreateCampusUserDto, manager: EntityManager) {
    const campusUsersRepository = manager.getCustomRepository(CampusUsersRepository);

    const campusUser = await campusUsersRepository.findOne({
      where: { campus: { id: createCampusUserDto.campusId } },
      withDeleted: true,
    });

    if (!campusUser) {
      if (!(await this.firebaseUsersService.hasEmail(createCampusUserDto.email))) {
        const campusUser = await campusUsersRepository.saveAndReload({
          ...createCampusUserDto,
          campus: new Campus({ id: createCampusUserDto.campusId }),
        });

        const user = await this.firebaseUsersService.create(campusUser.id, createCampusUserDto, manager);
        return this.mergeUserAndCampusUser(user, campusUser);
      } else {
        throw new ConflictException(`Ya existe un usuario sede con el email elegido.`);
      }
    } else if (campusUser.deleteDate) {
      return campusUsersRepository.recover(campusUser);
    } else {
      throw new ConflictException(`Ya existe un usuario sede con la sede elegida.`);
    }
  }

  async update(id: string, updateCampusUserDto: PartialUpdateCampusUserDto, manager: EntityManager) {
    const campusUser = await manager
      .getCustomRepository(CampusUsersRepository)
      .updateAndReload(id, updateCampusUserDto);
    const user = await this.firebaseUsersService.update(id, updateCampusUserDto, manager);
    return this.mergeUserAndCampusUser(user, campusUser);
  }

  async delete(id: string, manager: EntityManager) {
    const campusUsersRepository = manager.getCustomRepository(CampusUsersRepository);

    const campusUser = await campusUsersRepository.findOne(id);
    if (campusUser) {
      const id = campusUser.id; //* "remove" method erases 'id' property from object
      await campusUsersRepository.remove(campusUser);
      await this.firebaseUsersService.delete(id);
      return;
    } else {
      throw new NotFoundException(`Usuario sede ${id} no encontrado.`);
    }
  }

  //! Utility methods
  async findAndMergeUserAndCampusUser(campusUser: CampusUser, manager: EntityManager) {
    const user = await this.firebaseUsersService.findById(campusUser.id, manager);
    return this.mergeUserAndCampusUser(user, campusUser);
  }

  async findAndMergeUsersAndCampusUsers(campusUsers: CampusUser[], manager: EntityManager) {
    const users = await this.firebaseUsersService.findAllById(
      campusUsers.map((campusUser) => campusUser.id),
      manager,
    );
    return this.mergeUsersAndCampusUsers(users, campusUsers);
  }

  mergeUserAndCampusUser(user: User, campusUser: CampusUser) {
    return new CampusUser({ ...campusUser, ...user });
  }

  mergeUsersAndCampusUsers(users: User[], campusUsers: CampusUser[]) {
    return campusUsers.map((campusUser) =>
      this.mergeUserAndCampusUser(
        users.find((user) => user.id === campusUser.id),
        campusUser,
      ),
    );
  }
}
