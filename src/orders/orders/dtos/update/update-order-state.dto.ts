import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { EOrderState } from '../../enums/e-order-state.enum';

export class UpdateOrderStateDto {
  @IsIn([EOrderState.CANCELLED, EOrderState.DELIVERED, EOrderState.UNDELIVERED])
  @ApiProperty({ description: `Order's state code`, example: EOrderState.DELIVERED })
  code!: EOrderState;
}
