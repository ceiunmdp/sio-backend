import { PartialType } from '@nestjs/swagger';
import { UpdateCourseDto } from './update-course.dto';

export class PartialUpdateCourseDto extends PartialType(UpdateCourseDto) {}
