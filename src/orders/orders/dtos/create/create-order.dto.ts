import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { CreateOrderFileDto } from 'src/orders/order-files/dtos/create/create-order-file.dto';

export class CreateOrderDto {
  @IsEntityExist(Campus)
  @ApiProperty({
    name: 'campus_id',
    description: `Campus's UUID where order will be placed`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  campusId!: string;

  @AutoMap(() => CreateOrderFileDto)
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderFileDto)
  @ApiProperty({
    name: 'order_files',
    description: `Order's files with their configurations`,
    type: [CreateOrderFileDto],
  })
  orderFiles!: CreateOrderFileDto[];

  @ApiHideProperty()
  subtotal?: number;

  @ApiHideProperty()
  discount?: number;

  @ApiHideProperty()
  total?: number;

  constructor(partial: Partial<CreateOrderDto>) {
    Object.assign(this, partial);
  }
}
