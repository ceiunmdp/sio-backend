import { AutoMapper, mapFrom, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dto/response-course.dto';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { ResponseCareerDto } from '../dto/response-career.dto';
import { Career } from '../entities/career.entity';

// @Profile()
export class CareerProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Career, ResponseCareerDto, { includeBase: [BaseEntity, ResponseBaseEntity] }).forMember(
      (dest) => dest.courses,
      mapFrom((src) => {
        if (src.careerCourseRelations) {
          const courses = src.careerCourseRelations.map((ternary) => ternary.course).filter((course) => course != null);
          return mapper.mapArray(courses, ResponseCourseDto, Course);
        } else {
          return [];
        }
      }),
    );

    // .afterMap(async (source, destination) => {
    //   // use afterMap callback here
    //   const courses = source.careerCourseRelations.map((ternary) => ternary.course);
    //   destination.courses = mapper.mapArray(courses, ResponseCourseDto, Course);
    // });
  }
}
