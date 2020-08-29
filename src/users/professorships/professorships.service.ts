import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { GenericSubUserService } from '../utils/generic-sub-user.service';
import { Professorship } from './entities/professorship.entity';

@Injectable()
export class ProfessorshipsService extends GenericSubUserService<Professorship> {
  constructor(usersService: UsersService) {
    super(usersService, Professorship);
  }

  // async create(createProfessorshipDto: Partial<CreateProfessorshipDto>, manager: EntityManager) {
  //   const professorshipsRepository = manager.getCustomRepository(ProfessorshipsRepository);

  //   const professorship = await professorshipsRepository.findOne({
  //     where: { course: { id: createProfessorshipDto.courseId } },
  //     withDeleted: true,
  //   });

  //   if (!professorship) {
  //     const newCampusUser = await professorshipsRepository.saveAndReload({
  //       ...createCampusUserDto,
  //       campus: new Campus({ id: createCampusUserDto.campusId }),
  //     });

  //     const user = await this.usersService.create(newCampusUser.id, createCampusUserDto, manager);
  //     return this.userMerger.mergeSubUser(user, newCampusUser);
  //   } else if (professorship.deleteDate) {
  //     return professorshipsRepository.recover(professorship);
  //   } else {
  //     throw new ConflictException(`Ya existe un usuario con la sede elegida.`);
  //   }
  // }
}
