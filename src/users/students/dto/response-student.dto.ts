import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
@Exclude()
export class ResponseStudentDto extends ResponseUserDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Student's balance`, example: 151.5 })
  balance!: number;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Student's DNI`, example: '40123456' })
  dni!: string;

  constructor(partial: Partial<ResponseStudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
