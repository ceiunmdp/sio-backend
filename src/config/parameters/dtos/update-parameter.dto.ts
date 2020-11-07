import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateParameterDto {
  @IsInt()
  @ApiProperty({ description: `Parameter's new value`, example: 77 })
  value!: number;
}
