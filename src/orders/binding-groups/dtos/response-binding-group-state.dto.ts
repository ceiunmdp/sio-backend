import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { EBindingGroupState } from '../enums/e-binding-group-state.enum';

@Exclude()
export class ResponseBindingGroupStateDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Binding group state's name`, example: 'Ringed' })
  name!: string;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Binding Group state's code`, example: EBindingGroupState.RINGED })
  code!: EBindingGroupState;

  constructor(partial: Partial<ResponseBindingGroupStateDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
