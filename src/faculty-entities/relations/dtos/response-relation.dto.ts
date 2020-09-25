import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { ResponseCareerDto } from 'src/faculty-entities/careers/dtos/response-career.dto';

@Exclude()
export class ResponseRelationDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Relation's name`, example: 'First year' })
  name!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Relation's careers`, type: [ResponseCareerDto] })
  careers!: ResponseCareerDto[];

  constructor(partial: Partial<ResponseRelationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
