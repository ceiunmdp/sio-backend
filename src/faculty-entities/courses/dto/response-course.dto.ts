import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Exclude()
export class ResponseCourseDto extends ResponseBaseEntity {
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Name of course' })
  name!: string;

  constructor(partial: Partial<ResponseCourseDto>) {
    super();
    Object.assign(this, partial);
  }
}
