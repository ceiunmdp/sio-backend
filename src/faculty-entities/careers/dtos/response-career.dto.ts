import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups.constant';

@Exclude()
export class ResponseCareerDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: 'Name of career', example: 'Software Engineering' })
  name!: string;

  constructor(partial: Partial<ResponseCareerDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
