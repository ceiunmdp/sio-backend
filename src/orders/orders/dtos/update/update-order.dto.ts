import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateOrderStateDto } from './update-order-state.dto';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: `Order's UUID`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  id?: string;

  @AutoMap(() => UpdateOrderStateDto)
  @ValidateNested()
  @Type(() => UpdateOrderStateDto)
  @ApiProperty({ description: `Order's state` })
  state!: UpdateOrderStateDto;
}
