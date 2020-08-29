import { ConflictException, Injectable } from '@nestjs/common';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { CampusUsersRepository } from './campus-users.repository';
import { CreateCampusUserDto } from './dto/create-campus-user.dto';
import { CampusUser } from './entities/campus-user.entity';

@Injectable()
export class CampusUsersService extends GenericSubUserService<CampusUser> {
  constructor(usersService: UsersService) {
    super(usersService, CampusUser);
  }

  //! Override specific method
  async create(createCampusUserDto: Partial<CreateCampusUserDto>, manager: EntityManager) {
    const campusUsersRepository = manager.getCustomRepository(CampusUsersRepository);

    const campusUser = await campusUsersRepository.findOne({
      where: { campus: { id: createCampusUserDto.campusId } },
      withDeleted: true,
    });

    if (!campusUser) {
      const newCampusUser = await campusUsersRepository.saveAndReload({
        ...createCampusUserDto,
        campus: new Campus({ id: createCampusUserDto.campusId }),
      });

      const user = await this.usersService.create(newCampusUser.id, createCampusUserDto, manager);
      return this.userMerger.mergeSubUser(user, newCampusUser);
    } else if (campusUser.deleteDate) {
      return campusUsersRepository.recover(campusUser);
    } else {
      throw new ConflictException(`Ya existe un usuario con la sede elegida.`);
    }
  }
}
