import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { ScholarshipProfile } from 'src/users/scholarships/profiles/scholarship.profile';
import { ResponseUserDto } from '../../users/dtos/response-user.dto';
import { User } from '../../users/entities/user.entity';
import { ResponseStudentDto } from '../dto/response-student.dto';
import { Student } from '../entities/student.entity';

@Profile()
export class StudentProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Student, ResponseStudentDto, { includeBase: [User, ResponseUserDto] });

    //! Important: ScholarshipProfile must be imported after the student map has been created
    mapper.addProfile(ScholarshipProfile);
  }
}
