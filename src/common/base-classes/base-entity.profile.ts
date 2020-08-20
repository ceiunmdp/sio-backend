import { AutoMapper, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from './base-entity.entity';
import { ResponseBaseEntity } from './response-base-entity.dto';

// @Profile()
export class BaseEntityProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(BaseEntity, ResponseBaseEntity);
  }
}
