import { PartialType } from '@nestjs/swagger';
import { UpdateStudentBulkDto } from './update-student-bulk.dto';

export class PartialUpdateStudentBulkDto extends PartialType(UpdateStudentBulkDto) {}

// TODO
// export class PartialUpdateStudentBulkDto extends IntersectionType(
//   PickType(UpdateStudentBulkDto, ['id']),
//   PartialType(UpdateStudentBulkDto),
// ) {}
