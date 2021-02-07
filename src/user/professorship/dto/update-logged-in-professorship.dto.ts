import { OmitType } from '@nestjs/swagger';
import { UpdateProfessorshipDto } from 'src/users/professorships/dtos/update-professorship.dto';

export class UpdateLoggedInProfessorshipDto extends OmitType(UpdateProfessorshipDto, [
  'availableStorage',
  'disabled',
]) {}
