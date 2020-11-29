import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EBindingGroupState } from '../enums/e-binding-group-state.enum';

export class UpdateBindingGroupStateDto {
  @IsIn([EBindingGroupState.TO_RING, EBindingGroupState.RINGED])
  @ApiProperty({ description: `Binding Group's state code`, example: EBindingGroupState.RINGED })
  code!: EBindingGroupState;
}
