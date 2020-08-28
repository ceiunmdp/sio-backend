import { AutoMapper, mapDefer, mapFrom, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseUserDto } from 'src/users/firebase-users/dto/response-user.dto';
import { User } from 'src/users/firebase-users/entities/user.entity';
import { ResponseCampusUserDto } from '../dto/response-campus-user.dto';
import { CampusUser } from '../entities/campus-user.entity';

@Profile()
export class CampusUserProfile extends ProfileBase {
  constructor(private readonly mapper: AutoMapper) {
    super();
    this.createMapFromCampusUserToResponseCampusUserDto();
  }

  createMapFromCampusUserToResponseCampusUserDto() {
    this.mapper.createMap(CampusUser, ResponseCampusUserDto, { includeBase: [User, ResponseUserDto] }).forMember(
      (responseCampusUserDto) => responseCampusUserDto.campus,
      mapDefer((campusUser) => {
        if (!campusUser.campus) {
          return mapFrom((campusUser) => {
            return { id: campusUser.campusId };
          });
        }
        return mapFrom((campusUser) => campusUser.campus);
      }),
    );

    //! Not called with mapArray()
    // .afterMap(async (campusUser, responseCampusUserDto) => {
    //   if (!responseCampusUserDto.campus) {
    //     responseCampusUserDto.campus = { id: campusUser.campusId };
    //   }
    // });
  }
}
