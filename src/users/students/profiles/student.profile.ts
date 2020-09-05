import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseUserDto } from '../../users/dto/response-user.dto';
import { User } from '../../users/entities/user.entity';
import { ResponseStudentDto } from '../dto/response-student.dto';
import { Student } from '../entities/student.entity';

@Profile()
export class StudentProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Student, ResponseStudentDto, { includeBase: [User, ResponseUserDto] });
  }
}
