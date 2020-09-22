import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';

@Exclude()
export class ResponseCourseDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: 'Name of course', example: 'Introduction to Artificial Intelligence' })
  name!: string;

  constructor(partial: Partial<ResponseCourseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
