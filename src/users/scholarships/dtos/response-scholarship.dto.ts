import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';
import { ResponseStudentDto } from 'src/users/students/dto/response-student.dto';

@Exclude()
export class ResponseScholarshipDto extends ResponseStudentDto {
  @Expose({ groups: [Group.ADMIN, Group.SCHOLARSHIP] })
  @ApiProperty({ name: 'available_copies', description: `Scholarship's available copies per quarter`, example: 500 })
  availableCopies!: number;

  @Expose({ groups: [Group.ADMIN, Group.SCHOLARSHIP] })
  @ApiProperty({ name: 'remaining_copies', description: `Scholarship's remaining copies per quarter`, example: 300 })
  remainingCopies!: number;

  constructor(partial: Partial<ResponseScholarshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
