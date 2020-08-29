import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseUserDto } from 'src/users/users/dto/response-user.dto';
import { User } from 'src/users/users/entities/user.entity';
import { ResponseAdminDto } from '../dto/response-admin.dto';
import { Admin } from '../entities/admin.entity';

@Profile()
export class AdminProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Admin, ResponseAdminDto, { includeBase: [User, ResponseUserDto] });
  }
}
