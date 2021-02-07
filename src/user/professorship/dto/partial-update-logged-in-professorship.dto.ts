import { PartialType } from '@nestjs/swagger';
import { UpdateLoggedInProfessorshipDto } from './update-logged-in-professorship.dto';

export class PartialUpdateLoggedInProfessorshipDto extends PartialType(UpdateLoggedInProfessorshipDto) {}
