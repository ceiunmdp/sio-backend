import { Controller, OnModuleInit } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AutoMapper, InjectMapper } from 'nestjsx-automapper';
import { Path } from 'src/common/enums/path.enum';
import { ProfessorshipProfile } from './profiles/professorship.profile';
import { RoleProfile } from './profiles/role.profile';
import { UserProfile } from './profiles/user.profile';

@ApiTags('Users')
@Controller(Path.USERS)
export class UsersController implements OnModuleInit {
  constructor(@InjectMapper() private readonly mapper: AutoMapper) {}

  onModuleInit() {
    this.mapper.addProfile(UserProfile);
    this.mapper.addProfile(ProfessorshipProfile);
    this.mapper.addProfile(RoleProfile);
  }
}
