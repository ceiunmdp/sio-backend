import { OmitType } from '@nestjs/swagger';
import { PartialUpdateUserDto } from 'src/users/users/dtos/partial-update-user.dto';

export class PartialUpdateLoggedInUserDto extends OmitType(PartialUpdateUserDto, ['disabled']) {}
