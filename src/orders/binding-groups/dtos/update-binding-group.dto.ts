import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateBindingGroupStateDto } from './update-binding-group-state.dto';

export class UpdateBindingGroupDto {
  @AutoMap(() => UpdateBindingGroupStateDto)
  @ValidateNested()
  @Type(() => UpdateBindingGroupStateDto)
  @ApiProperty({ description: `Binding Group's state` })
  state!: UpdateBindingGroupStateDto;
}
