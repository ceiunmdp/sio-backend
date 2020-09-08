import { PartialType } from '@nestjs/swagger';
import { UpdateScholarshipDto } from './update-scholarship.dto';

export class PartialUpdateScholarshipDto extends PartialType(UpdateScholarshipDto) {}
