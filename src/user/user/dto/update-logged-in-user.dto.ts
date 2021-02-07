import { OmitType } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/users/users/dtos/update-user.dto';

export class UpdateLoggedInUserDto extends OmitType(UpdateUserDto, ['disabled']) {}
