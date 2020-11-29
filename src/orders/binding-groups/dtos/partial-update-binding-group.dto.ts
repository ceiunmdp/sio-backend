import { PartialType } from '@nestjs/swagger';
import { UpdateBindingGroupDto } from './update-binding-group.dto';

export class PartialUpdateBindingGroupDto extends PartialType(UpdateBindingGroupDto) {}
