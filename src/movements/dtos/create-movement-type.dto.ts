import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EMovementType } from '../enums/e-movement-type.enum';

export class CreateMovementTypeDto {
  @IsIn([EMovementType.TOP_UP, EMovementType.TRANSFER])
  @ApiProperty({ description: `Movement type code`, example: EMovementType.TOP_UP })
  code!: EMovementType;
}
