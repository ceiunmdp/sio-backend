import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from './base-entity.entity';
import { ResponseBaseEntityDto } from './response-base-entity.dto';

@Profile()
export abstract class BaseEntityProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(BaseEntity, ResponseBaseEntityDto);
  }
}
