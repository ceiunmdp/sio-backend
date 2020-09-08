import { ConflictException, Injectable } from '@nestjs/common';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CampusUsersRepository } from './campus-users.repository';
import { CreateCampusUserDto } from './dtos/create-campus-user.dto';
import { CampusUser } from './entities/campus-user.entity';

@Injectable()
export class CampusUsersService extends GenericSubUserService<CampusUser> {
  constructor(usersService: UsersService) {
    super(usersService, CampusUser);
  }

  //! Override specific method
  async create(createCampusUserDto: Partial<CreateCampusUserDto>, manager: EntityManager) {
    const campusUsersRepository = this.getCampusUsersRepository(manager);

    if (!(await this.isCampusIdRepeated(createCampusUserDto.campusId, campusUsersRepository))) {
      const newCampusUser = await campusUsersRepository.saveAndReload({
        ...createCampusUserDto,
        campus: new Campus({ id: createCampusUserDto.campusId }),
      });

      // TODO: Copy 'id' to 'uid' after saving entity
      await campusUsersRepository.save({ ...newCampusUser, uid: newCampusUser.id });

      const user = await this.usersService.create({ ...createCampusUserDto, uid: newCampusUser.id }, manager);
      return this.userMerger.mergeSubUser(user, newCampusUser);
    } else {
      throw new ConflictException(`Ya existe un usuario con la sede elegida.`);
    }
  }

  private async isCampusIdRepeated(campusId: string, campusUsersRepository: CampusUsersRepository) {
    return !!(await campusUsersRepository.findOne({ where: { campus: { id: campusId } } }));
  }

  getCampusUsersRepository(manager: EntityManager) {
    return manager.getCustomRepository(CampusUsersRepository);
  }
}
