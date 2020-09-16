import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseRegistrationTokenDto } from '../dtos/response-registration-token.dto';
import { RegistrationToken } from '../entities/registration-token.entity';

@Profile()
export class RegistrationTokenProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(RegistrationToken, ResponseRegistrationTokenDto, {
      includeBase: [BaseEntity, ResponseBaseEntityDto],
    });
  }
}
