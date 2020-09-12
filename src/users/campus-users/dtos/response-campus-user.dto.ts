import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { Group } from 'src/common/classes/group.class';
import { ResponseCampusDto } from 'src/faculty-entities/campus/dtos/response-campus.dto';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';

@Exclude()
export class ResponseCampusUserDto extends ResponseUserDto {
  @AutoMap(() => ResponseCampusDto)
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `User's campus` })
  campus!: ResponseCampusDto;

  constructor(partial: Partial<ResponseCampusUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
