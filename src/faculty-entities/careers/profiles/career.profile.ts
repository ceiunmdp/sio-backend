import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCareerDto } from '../dto/response-career.dto';
import { Career } from '../entities/career.entity';

@Profile()
export class CareerProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Career, ResponseCareerDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
