import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';

export class UpdateItemDto {
  @IsPositive()
  @ApiProperty({ description: `Item's price`, example: 2.5 })
  price!: number;
}
