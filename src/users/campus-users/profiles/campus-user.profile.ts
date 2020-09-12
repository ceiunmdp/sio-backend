import { AutoMapper, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseCampusDto } from 'src/faculty-entities/campus/dtos/response-campus.dto';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { User } from 'src/users/users/entities/user.entity';
import { ResponseCampusUserDto } from '../dtos/response-campus-user.dto';
import { CampusUser } from '../entities/campus-user.entity';

@Profile()
export class CampusUserProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromCampusUserToResponseCampusUserDto(mapper);
  }

  createMapFromCampusUserToResponseCampusUserDto(mapper: AutoMapper) {
    mapper.createMap(CampusUser, ResponseCampusUserDto, { includeBase: [User, ResponseUserDto] }).forMember(
      (responseCampusUserDto) => responseCampusUserDto.campus,
      mapDefer((campusUser) =>
        campusUser.campus
          ? mapWith(ResponseCampusDto, (campusUser) => campusUser.campus)
          : mapFrom((campusUser) => ({ id: campusUser.campusId })),
      ),
    );

    //! Not called with mapArray()
    // .afterMap(async (campusUser, responseCampusUserDto) => {
    //   if (!responseCampusUserDto.campus) {
    //     responseCampusUserDto.campus = { id: campusUser.campusId };
    //   }
    // });
  }
}
