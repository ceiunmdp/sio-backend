import { ApiProperty } from '@nestjs/swagger';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { CreateUserDto } from 'src/users/users/dtos/create-user.dto';

export class CreateProfessorshipDto extends CreateUserDto {
  @IsEntityExist(Course)
  @ApiProperty({
    name: 'course_id',
    description: `Course's UUID related to user`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  courseId!: string;
}
