import { IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  name: string;
}
