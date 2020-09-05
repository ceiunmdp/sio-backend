import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRelationDto {
  @IsString()
  @ApiProperty({ description: `Relation's name`, example: 'First year' })
  name: string;
}
