import { PartialType } from '@nestjs/swagger';
import { UpdateCampusUserDto } from './update-campus-user.dto';

export class PartialUpdateCampusUserDto extends PartialType(UpdateCampusUserDto) {}
