import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateBindingGroupDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ description: `Binding group's id`, example: 2 })
  id!: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ description: `Position inside binding group`, example: 4 })
  position!: number;
}
