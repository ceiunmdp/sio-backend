import { OmitType } from '@nestjs/swagger';
import { UpdateCampusUserDto } from 'src/users/campus-users/dtos/update-campus-user.dto';

export class UpdateLoggedInCampusUserDto extends OmitType(UpdateCampusUserDto, ['disabled']) {}
