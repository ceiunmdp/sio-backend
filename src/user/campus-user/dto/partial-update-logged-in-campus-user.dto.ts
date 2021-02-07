import { PartialType } from '@nestjs/swagger';
import { UpdateLoggedInCampusUserDto } from './update-logged-in-campus-user.dto';

export class PartialUpdateLoggedInCampusUserDto extends PartialType(UpdateLoggedInCampusUserDto) {}
