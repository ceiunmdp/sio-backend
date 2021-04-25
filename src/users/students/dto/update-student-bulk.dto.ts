import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UpdateStudentDto } from 'src/users/students/dto/update-student.dto';

export class UpdateStudentBulkDto extends UpdateStudentDto {
  @IsUUID()
  @ApiProperty({ description: 'UUID', example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d' })
  id!: string;
}
