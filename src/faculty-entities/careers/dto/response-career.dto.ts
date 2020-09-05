import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dto/response-course.dto';

@Exclude()
export class ResponseCareerDto extends ResponseBaseEntity {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: 'Name of career', example: 'Software Engineering' })
  name!: string;

  @Expose({ groups: [Group.ADMIN] })
  @AutoMap(() => ResponseCourseDto)
  @ApiProperty({ description: 'Courses of career', type: [ResponseCourseDto] })
  courses: ResponseCourseDto[];

  constructor(partial: Partial<ResponseCareerDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
