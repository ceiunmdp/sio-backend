import { PartialType } from '@nestjs/swagger';
import { UpdateOrderDto } from './update-order.dto';

export class PartialUpdateOrderDto extends PartialType(UpdateOrderDto) {}
