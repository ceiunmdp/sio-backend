import { Exclude } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';

@Exclude()
export class ResponseCareerCourseRelationDto extends ResponseBaseEntity {
  constructor(partial: Partial<ResponseCareerCourseRelationDto>) {
    super();
    Object.assign(this, partial);
  }
}
