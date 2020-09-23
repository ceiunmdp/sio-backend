import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRelationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Relation's name`, example: 'First year' })
  name!: string;
}
