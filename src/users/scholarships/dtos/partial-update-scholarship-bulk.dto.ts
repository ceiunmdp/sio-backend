import { PartialType } from '@nestjs/swagger';
import { UpdateScholarshipBulkDto } from './update-scholarship-bulk.dto';

export class PartialUpdateScholarshipBulkDto extends PartialType(UpdateScholarshipBulkDto) {}

// TODO
// export class PartialUpdateScholarshipBulkDto extends IntersectionType(
//   PartialType(UpdateScholarshipBulkDto),
//   PickType(UpdateScholarshipBulkDto, ['id']),
// ) {}
