import { PartialType } from '@nestjs/swagger';
import { UpdateLoggedInUserDto } from './update-logged-in-user.dto';

export class PartialUpdateLoggedInUserDto extends PartialType(UpdateLoggedInUserDto) {}
