import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { Group } from 'src/common/classes/group.class';
import { ResponseUserDto } from 'src/users/users/dto/response-user.dto';

@Exclude()
export class ResponseStudentDto extends ResponseUserDto {
  @AutoMap()
  @Expose({ groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({ description: `Student's balance`, example: 151.5 })
  balance!: number;

  @AutoMap()
  @Expose({ groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({ description: `Student's DNI`, example: '40123456' })
  dni!: string;

  constructor(partial: Partial<ResponseStudentDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
