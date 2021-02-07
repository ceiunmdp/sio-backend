import { PartialType } from '@nestjs/swagger';
import { UpdateLoggedInStudentDto } from './update-logged-in-student.dto';

export class PartialUpdateLoggedInStudentDto extends PartialType(UpdateLoggedInStudentDto) {}
