import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';

@Exclude()
export class ResponseCourseDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: 'Name of course', example: 'Introduction to Artificial Intelligence' })
  name!: string;

  constructor(partial: Partial<ResponseCourseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
