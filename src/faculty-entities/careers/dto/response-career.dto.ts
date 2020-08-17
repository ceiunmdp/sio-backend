import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Career } from '../entities/career.entity';

@Exclude()
export class ResponseCareerDto extends ResponseBaseEntity {
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Name of career' })
  name!: string;

  // @Expose()
  // @AutoMap(() => ResponseTernaryDto)
  // @ApiProperty({ description: 'Linking list between careers, courses and relations' })
  // careerCourseRelations!: ResponseTernaryDto[];

  // @Expose()
  // @AutoMap(() => ResponseCourseDto)
  // @ApiProperty({ description: 'Courses of career' })
  // courses: ResponseCourseDto[];

  constructor(partial: Partial<Career>) {
    super();
    Object.assign(this, partial);
  }
}
