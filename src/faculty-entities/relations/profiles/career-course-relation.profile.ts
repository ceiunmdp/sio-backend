import { AutoMapper, ProfileBase } from 'nestjsx-automapper';
import { ResponseCareerCourseRelationDto } from '../dto/response-career-course-relation.dto';
import { CareerCourseRelation } from '../entities/career-course-relation.entity';

// @Profile()
export class CareerCourseRelationProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    mapper.createMap(CareerCourseRelation, ResponseCareerCourseRelationDto);
  }
}
