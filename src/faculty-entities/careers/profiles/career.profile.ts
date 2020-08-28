import { AutoMapper, mapFrom, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dto/response-course.dto';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { ResponseCareerDto } from '../dto/response-career.dto';
import { Career } from '../entities/career.entity';

@Profile()
export class CareerProfile extends ProfileBase {
  constructor(private readonly mapper: AutoMapper) {
    super();
    this.createMapFromCareerToResponseCareerDto();
  }

  createMapFromCareerToResponseCareerDto() {
    this.mapper.createMap(Career, ResponseCareerDto, { includeBase: [BaseEntity, ResponseBaseEntity] }).forMember(
      (responseCareerDto) => responseCareerDto.courses,
      mapFrom((career) => {
        if (career.careerCourseRelations) {
          const courses = career.careerCourseRelations
            .map((ternary) => ternary.course)
            .filter((course) => course != null);
          return this.mapper.mapArray(courses, ResponseCourseDto, Course);
        } else {
          return [];
        }
      }),
    );
  }
}
