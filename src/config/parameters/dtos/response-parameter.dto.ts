import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups.constant';
import { ParameterType } from '../enums/parameter-type.enum';

@Exclude()
export class ResponseParameterDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Parameter's name`, example: 'Minimum balance allowed' })
  name!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Parameter's code`, example: ParameterType.USERS_MINIMUM_BALANCE_ALLOWED })
  code!: ParameterType;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Parameter's value`, example: '500' })
  value!: string;

  constructor(partial: Partial<ResponseParameterDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
