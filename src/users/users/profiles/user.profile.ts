import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseUserDto } from '../dtos/response-user.dto';
import { User } from '../entities/user.entity';

@Profile()
export class UserProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(User, ResponseUserDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
