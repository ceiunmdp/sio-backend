import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
import { Student } from 'src/users/students/entities/student.entity';
import { ResponseLoggedInStudentDto } from '../dto/response-logged-in-student.dto';

@Profile()
export class LoggedInStudentProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Student, ResponseLoggedInStudentDto, { includeBase: [Student, ResponseStudentDto] });
  }
}
