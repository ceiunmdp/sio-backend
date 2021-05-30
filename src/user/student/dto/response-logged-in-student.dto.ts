import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';
@Exclude()
export class ResponseLoggedInStudentDto extends ResponseStudentDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Student's balance`, example: 151.5 })
  balance!: number;

  constructor(partial: Partial<ResponseLoggedInStudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
