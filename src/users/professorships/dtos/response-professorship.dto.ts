import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { Group } from 'src/common/classes/group.class';
import { ResponseCourseDto } from 'src/faculty-entities/courses/dtos/response-course.dto';
import { ResponseUserDto } from '../../users/dtos/response-user.dto';

@Exclude()
export class ResponseProfessorshipDto extends ResponseUserDto {
  @AutoMap(() => ResponseCourseDto)
  @Expose({ groups: [Group.ADMIN, Group.PROFESSORSHIP] })
  @ApiProperty({ description: `Professorships's course` })
  course!: ResponseCourseDto;

  @Expose({ name: 'available_storage', groups: [Group.ADMIN, Group.PROFESSORSHIP] })
  @ApiProperty({ name: 'available_storage', description: 'Available storage [bytes]', example: 1073741824 })
  availableStorage!: number;

  @Expose({ name: 'storage_used', groups: [Group.ADMIN, Group.PROFESSORSHIP] })
  @ApiProperty({ name: 'storage_used', description: 'Storage already used [bytes]', example: 75122 })
  storageUsed!: number;

  constructor(partial: Partial<ResponseProfessorshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
