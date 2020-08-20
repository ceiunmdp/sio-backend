import { AutoMapper, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCourseDto } from '../dto/response-course.dto';
import { Course } from '../entities/course.entity';

// @Profile()
export class CourseProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(Course, ResponseCourseDto, { includeBase: [BaseEntity, ResponseBaseEntity] });
  }
}
