import { ApiProperty } from '@nestjs/swagger';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { CreateUserDto } from 'src/users/users/dto/create-user.dto';

export class CreateProfessorshipDto extends CreateUserDto {
  @IsEntityExist(Course)
  @ApiProperty({ name: 'course_id', description: `Course's UUID related to user` })
  courseId!: string;
}
