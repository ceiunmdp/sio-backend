import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateParameterDto {
  @IsString()
  @ApiProperty({ description: `Parameter's new value`, example: '500' })
  value!: string;
}
