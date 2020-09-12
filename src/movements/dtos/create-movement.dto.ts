import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { User } from 'src/users/users/entities/user.entity';
import { CreateMovementTypeDto } from './create-movement-type.dto';

export class CreateMovementDto {
  @IsEntityExist(User)
  @ApiProperty({
    name: 'source_id',
    description: `Source user's UUID`,
    example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d0',
  })
  sourceId!: string;

  @IsEntityExist(User)
  @ApiProperty({
    name: 'target_id',
    description: `Target user's UUID`,
    example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d0',
  })
  targetId!: string;

  @AutoMap(() => CreateMovementTypeDto)
  @ValidateNested()
  @Type(() => CreateMovementTypeDto)
  @ApiProperty({ description: `Movement's type` })
  type!: CreateMovementTypeDto;

  @IsPositive()
  @ApiProperty({ description: `Movement's amount`, example: 20 })
  amount!: number;
}
