import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateBindingGroupStateDto } from './update-binding-group-state.dto';

export class UpdateBindingGroupDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: `Binding Group's UUID`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  id?: string;

  @AutoMap(() => UpdateBindingGroupStateDto)
  @ValidateNested()
  @Type(() => UpdateBindingGroupStateDto)
  @ApiProperty({ description: `Binding Group's state` })
  state!: UpdateBindingGroupStateDto;
}
