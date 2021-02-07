import { PartialType } from '@nestjs/swagger';
import { UpdateLoggedInScholarshipDto } from './update-logged-in-scholarship.dto';

export class PartialUpdateLoggedInScholarshipDto extends PartialType(UpdateLoggedInScholarshipDto) {}
