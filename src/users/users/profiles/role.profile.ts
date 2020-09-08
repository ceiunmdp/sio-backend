import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseRoleDto } from '../dtos/response-role.dto';
import { Role } from '../entities/role.entity';

@Profile()
export class RoleProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Role, ResponseRoleDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
