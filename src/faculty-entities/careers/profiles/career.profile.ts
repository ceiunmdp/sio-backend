import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCareerDto } from '../dtos/response-career.dto';
import { Career } from '../entities/career.entity';

@Profile()
export class CareerProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromCareerToResponseCareerDto(mapper);
  }

  createMapFromCareerToResponseCareerDto(mapper: AutoMapper) {
    mapper.createMap(Career, ResponseCareerDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
  }
}
