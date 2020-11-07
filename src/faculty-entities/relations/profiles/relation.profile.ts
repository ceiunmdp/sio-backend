import { sortBy } from 'lodash';
import { AutoMapper, fromValue, mapDefer, mapWith, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCareerDto } from 'src/faculty-entities/careers/dtos/response-career.dto';
import { ResponseRelationDto } from '../dtos/response-relation.dto';
import { Relation } from '../entities/relation.entity';

@Profile()
export class RelationProfile extends ProfileBase {
  constructor(mapper: AutoMapper) {
    super();
    this.createMapFromRelationToResponseRelationDto(mapper);
  }

  createMapFromRelationToResponseRelationDto(mapper: AutoMapper) {
    mapper.createMap(Relation, ResponseRelationDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] }).forMember(
      (responseRelationDto) => responseRelationDto.careers,
      mapDefer((relation) =>
        relation.careerCourseRelations
          ? mapWith(ResponseCareerDto, (relation) =>
              sortBy(
                relation.careerCourseRelations.map((ternary) => ternary.career),
                (career) => career.name,
              ),
            )
          : fromValue(undefined),
      ),
    );
  }
}
