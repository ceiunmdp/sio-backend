import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsEntitiesExist } from 'src/common/decorators/is-entities-exist.decorator';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';

export class UpdateFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `File's name`, example: 'Practice N° 1' })
  name!: string;

  @IsEntitiesExist(Course)
  @ApiProperty({
    name: 'courses_ids',
    description: `Courses's UUIDs file belongs to`,
    example: ['0de63cc8-d62d-4ea1-aa37-1846b6cf429d0', '911989ef-bb7c-4ca0-8cb3-bc2f976705a0'],
  })
  coursesIds!: string[];

  constructor(partial: Partial<UpdateFileDto>) {
    Object.assign(this, partial);
  }
}
