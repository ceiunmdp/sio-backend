import { groupBy, sortBy, uniqBy } from 'lodash';
import { AutoMapper, fromValue, mapDefer, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseRelationDto } from 'src/faculty-entities/relations/dtos/response-relation.dto';
import { ResponseCourseDto } from '../dtos/response-course.dto';
import { Course } from '../entities/course.entity';

@Profile()
export class CourseProfile extends ProfileBase {
  constructor(private readonly mapper: AutoMapper) {
    super();
    this.createMapFromCourseToResponseCourseDto();
  }

  createMapFromCourseToResponseCourseDto() {
    this.mapper.createMap(Course, ResponseCourseDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] }).forMember(
      (responseCourseDto) => responseCourseDto.relations,
      mapDefer((course) =>
        course.careerCourseRelations
          ? mapWith(ResponseRelationDto, (course) => {
              const relationsSet = sortBy(
                uniqBy(
                  course.careerCourseRelations.map((ternary) => ternary.relation),
                  (relation) => relation.id,
                ),
                (relation) => relation.name,
              );
              const groupsByRelationId = groupBy(course.careerCourseRelations, (ternary) => ternary.relation.id);

              relationsSet.forEach((relation) => {
                relation.careerCourseRelations = groupsByRelationId[relation.id];
              });

              return relationsSet;
            })
          : fromValue([]),
      ),
    );
  }
}
