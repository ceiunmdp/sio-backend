import { PartialType } from '@nestjs/swagger';
import { UpdateItemDto } from './update-item.dto';

export class PartialUpdateItemDto extends PartialType(UpdateItemDto) {}
