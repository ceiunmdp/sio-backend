import { OmitType } from '@nestjs/swagger';
import { UpdateAdminDto } from 'src/users/admins/dtos/update-admin.dto';

export class UpdateLoggedInAdminDto extends OmitType(UpdateAdminDto, ['disabled']) {}
