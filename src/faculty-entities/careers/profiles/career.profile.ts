import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseCareerDto } from '../dto/response-career.dto';
import { Career } from '../entities/career.entity';

@Profile()
export class CareerProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Career, ResponseCareerDto);
    // .forMember(
    //   (dest) => dest.namee,
    //   mapFrom((src) => src.name),
    // );
  }
}
