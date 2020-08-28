import { PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto';

export class PartialUpdateUserDto extends PartialType(UpdateUserDto) {}
