import { PartialType } from '@nestjs/swagger';
import { UpdateStudentDto } from './update-student.dto';

export class PartialUpdateStudentDto extends PartialType(UpdateStudentDto) {}
