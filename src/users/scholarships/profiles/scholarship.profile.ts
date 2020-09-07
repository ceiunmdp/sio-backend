import { AutoMapper, ProfileBase } from 'nestjsx-automapper';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
import { Student } from 'src/users/students/entities/student.entity';
import { ResponseScholarshipDto } from '../dto/response-scholarship.dto';
import { Scholarship } from '../entities/scholarship.entity';

// @Profile()
export class ScholarshipProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Scholarship, ResponseScholarshipDto, { includeBase: [Student, ResponseStudentDto] });
  }
}
