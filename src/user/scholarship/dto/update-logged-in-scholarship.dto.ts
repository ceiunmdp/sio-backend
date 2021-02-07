import { OmitType } from '@nestjs/swagger';
import { UpdateScholarshipDto } from 'src/users/scholarships/dtos/update-scholarship.dto';

export class UpdateLoggedInScholarshipDto extends OmitType(UpdateScholarshipDto, [
  'availableCopies',
  'balance',
  'disabled',
  'remainingCopies',
  'type',
]) {}
