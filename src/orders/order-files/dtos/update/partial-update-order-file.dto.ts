import { PartialType } from '@nestjs/swagger';
import { UpdateOrderFileDto } from './update-order-file.dto';

export class PartialUpdateOrderFileDto extends PartialType(UpdateOrderFileDto) {}
