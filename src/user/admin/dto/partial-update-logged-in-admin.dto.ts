import { PartialType } from '@nestjs/swagger';
import { UpdateLoggedInAdminDto } from './update-logged-in-admin.dto';

export class PartialUpdateLoggedInAdminDto extends PartialType(UpdateLoggedInAdminDto) {}
