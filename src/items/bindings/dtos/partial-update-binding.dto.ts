import { PartialType } from '@nestjs/swagger';
import { UpdateBindingDto } from './update-binding.dto';

export class PartialUpdateBindingDto extends PartialType(UpdateBindingDto) {}
