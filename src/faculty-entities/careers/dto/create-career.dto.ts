import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { Career } from '../entities/career.entity';

export class CreateCareerDto {
  @IsString()
  @ApiProperty({ description: 'Name of career' })
  name!: string;

  @IsEntityExist(Career)
  careerId!: string;
}
