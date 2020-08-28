import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserType } from '../enums/user-type.enum';

@Exclude()
export class ResponseUserDto extends ResponseBaseEntity {
  @AutoMap()
  @Expose({ name: 'display_name', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'display_name', description: `User's name` })
  displayName!: string;

  @AutoMap()
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: `User's email` })
  email!: string;

  @AutoMap()
  @Expose({ name: 'email_verified', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'email_verified', description: `Flag that indicates if email is verified` })
  emailVerified!: boolean;

  @AutoMap()
  @Expose({ name: 'photo_url', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'photo_url', description: `User photo url` })
  photoURL!: string;

  @AutoMap(() => String)
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: `User's type` })
  type!: UserType;

  constructor(partial: Partial<ResponseUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
