import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ParameterType } from '../enums/parameter-type.enum';

@Exclude()
export class ResponseParameterDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Parameter's name`, example: 'Minimum balance allowed' })
  name!: string;

  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Parameter's code`, example: ParameterType.USERS_MINIMUM_BALANCE_ALLOWED })
  code!: ParameterType;

  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Parameter's value`, example: -20 })
  value!: number;

  constructor(partial: Partial<ResponseParameterDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
