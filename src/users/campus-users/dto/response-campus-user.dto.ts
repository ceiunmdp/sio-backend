import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseCampusDto } from 'src/faculty-entities/campus/dto/response-campus.dto';
import { ResponseUserDto } from 'src/users/firebase-users/dto/response-user.dto';

@Exclude()
export class ResponseCampusUserDto extends ResponseUserDto {
  @Expose({ groups: [UserRole.ADMIN] })
  @AutoMap(() => ResponseCampusDto)
  @ApiProperty({ description: `User's campus` })
  campus!: ResponseCampusDto;

  constructor(partial: Partial<ResponseCampusUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
