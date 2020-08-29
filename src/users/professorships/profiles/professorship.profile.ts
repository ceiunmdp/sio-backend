import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseUserDto } from '../../users/dto/response-user.dto';
import { User } from '../../users/entities/user.entity';
import { ResponseProfessorshipDto } from '../dto/response-professorship.dto';
import { Professorship } from '../entities/professorship.entity';

@Profile()
export class ProfessorshipProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Professorship, ResponseProfessorshipDto, { includeBase: [User, ResponseUserDto] });
  }
}
