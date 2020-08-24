import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseProfessorshipDto } from '../dto/response-professorship.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { Professorship } from '../entities/professorship.entity';
import { User } from '../entities/user.entity';

@Profile()
export class ProfessorshipProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Professorship, ResponseProfessorshipDto, { includeBase: [User, ResponseUserDto] });
  }
}
