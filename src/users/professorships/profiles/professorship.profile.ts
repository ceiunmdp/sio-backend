import { AutoMapper, mapDefer, mapFrom, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dtos/response-course.dto';
import { ResponseUserDto } from '../../users/dtos/response-user.dto';
import { User } from '../../users/entities/user.entity';
import { ResponseProfessorshipDto } from '../dtos/response-professorship.dto';
import { Professorship } from '../entities/professorship.entity';

@Profile()
export class ProfessorshipProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromProfessorshipToResponseProfessorshipDto(mapper);
  }

  createMapFromProfessorshipToResponseProfessorshipDto(mapper: AutoMapper) {
    mapper.createMap(Professorship, ResponseProfessorshipDto, { includeBase: [User, ResponseUserDto] }).forMember(
      (responseProfessorshipDto) => responseProfessorshipDto.course,
      mapDefer((professorship) =>
        professorship.course
          ? mapWith(ResponseCourseDto, (professorship) => professorship.course)
          : mapFrom((professorship) => ({ id: professorship.courseId })),
      ),
    );
  }
}
