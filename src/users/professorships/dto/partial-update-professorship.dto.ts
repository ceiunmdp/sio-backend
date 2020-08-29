import { PartialType } from '@nestjs/swagger';
import { UpdateProfessorshipDto } from './update-professorship.dto';

export class PartialUpdateProfessorshipDto extends PartialType(UpdateProfessorshipDto) {}
