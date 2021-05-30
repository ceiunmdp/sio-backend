import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseScholarshipDto } from 'src/users/scholarships/dtos/response-scholarship.dto';
import { Scholarship } from 'src/users/scholarships/entities/scholarship.entity';
import { ResponseLoggedInScholarshipDto } from '../dto/response-logged-in-scholarship.dto';

@Profile()
export class LoggedInScholarshipProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Scholarship, ResponseLoggedInScholarshipDto, {
      includeBase: [Scholarship, ResponseScholarshipDto],
    });
  }
}
