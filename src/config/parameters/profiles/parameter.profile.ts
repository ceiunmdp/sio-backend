import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseParameterDto } from '../dtos/response-parameter.dto';
import { Parameter } from '../entities/parameter.entity';

@Profile()
export class ParameterProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Parameter, ResponseParameterDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
  }
}
