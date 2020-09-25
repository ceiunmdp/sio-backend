import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { ResponseRelationDto } from 'src/faculty-entities/relations/dtos/response-relation.dto';

@Exclude()
export class ResponseCourseDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Course's name`, example: 'Introduction to Artificial Intelligence' })
  name!: string;

  @AutoMap(() => ResponseRelationDto)
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Course's relations`, type: [ResponseRelationDto] })
  relations!: ResponseRelationDto[];

  constructor(partial: Partial<ResponseCourseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
