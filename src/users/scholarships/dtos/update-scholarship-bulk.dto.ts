import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UpdateScholarshipDto } from './update-scholarship.dto';

export class UpdateScholarshipBulkDto extends UpdateScholarshipDto {
  @IsUUID()
  @ApiProperty({ description: 'UUID', example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d' })
  id!: string;
}
