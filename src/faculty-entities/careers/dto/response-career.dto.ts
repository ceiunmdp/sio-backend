import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dto/response-course.dto';

@Exclude()
export class ResponseCareerDto extends ResponseBaseEntity {
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Name of career' })
  name!: string;

  @Expose({ groups: [UserRole.ADMIN] })
  @AutoMap(() => ResponseCourseDto)
  @ApiProperty({ description: 'Courses of career', type: [ResponseCourseDto] })
  courses: ResponseCourseDto[];

  constructor(partial: Partial<ResponseCareerDto>) {
    super();
    Object.assign(this, partial);
  }
}
