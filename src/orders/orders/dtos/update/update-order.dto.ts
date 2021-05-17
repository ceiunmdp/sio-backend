import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateOrderStateDto } from './update-order-state.dto';

export class UpdateOrderDto {
  @AutoMap(() => UpdateOrderStateDto)
  @ValidateNested()
  @Type(() => UpdateOrderStateDto)
  @ApiProperty({ description: `Order's state` })
  state!: UpdateOrderStateDto;
}
