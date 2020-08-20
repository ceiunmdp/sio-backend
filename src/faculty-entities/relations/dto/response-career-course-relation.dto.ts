import { Exclude } from 'class-transformer';

@Exclude()
export class ResponseCareerCourseRelationDto {
  constructor(partial: Partial<ResponseCareerCourseRelationDto>) {
    Object.assign(this, partial);
  }
}
