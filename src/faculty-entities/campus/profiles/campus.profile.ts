import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCampusDto } from '../dtos/response-campus.dto';
import { Campus } from '../entities/campus.entity';

@Profile()
export class CampusProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Campus, ResponseCampusDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
