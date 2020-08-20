import { AutoMapper, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseFunctionalityDto } from '../dto/response-functionality.dto';
import { Functionality } from '../entities/functionality.entity';

// @Profile()
export class FunctionalityProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Functionality, ResponseFunctionalityDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
