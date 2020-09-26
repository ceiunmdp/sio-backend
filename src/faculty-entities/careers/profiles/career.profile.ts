import { AutoMapper, Profile, ProfileBase } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ResponseCareerDto } from '../dtos/response-career.dto';
import { Career } from '../entities/career.entity';

@Profile()
export class CareerProfile extends ProfileBase {
  constructor(private readonly mapper: AutoMapper) {
    super();
    this.createMapFromCareerToResponseCareerDto();
  }

  createMapFromCareerToResponseCareerDto() {
    this.mapper.createMap(Career, ResponseCareerDto, { includeBase: [BaseEntity, ResponseBaseEntityDto] });
    // .forMember(
    //   (responseCareerDto) => responseCareerDto.courses,
    //   mapDefer((career) =>
    //     career.careerCourseRelations
    //       ? mapWith(ResponseCourseDto, (career) => career.careerCourseRelations.map((ternary) => ternary.course))
    //       : fromValue(undefined),
    //   ),
    // );
  }
}
