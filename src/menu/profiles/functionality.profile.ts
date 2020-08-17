import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseFunctionalityDto } from '../dto/response-functionality.dto';
import { Functionality } from '../entities/functionality.entity';

@Profile()
export class FunctionalityProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Functionality, ResponseFunctionalityDto);
  }
}
