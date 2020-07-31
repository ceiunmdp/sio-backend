import { IsString } from 'class-validator';

export class CreateRelationDto {
  @IsString()
  name: string;
}
