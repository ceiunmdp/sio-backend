import { OmitType } from '@nestjs/swagger';
import { CreateCampusUserDto } from './create-campus-user.dto';

export class UpdateCampusUserDto extends OmitType(CreateCampusUserDto, ['campusId']) {}
