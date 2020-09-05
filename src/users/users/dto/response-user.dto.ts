import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { UserType } from '../enums/user-type.enum';

@Exclude()
export class ResponseUserDto extends ResponseBaseEntity {
  @AutoMap()
  @Expose({ name: 'display_name', groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({ name: 'display_name', description: `User's name`, example: 'John Doe' })
  displayName!: string;

  @AutoMap()
  @Expose({ groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({ description: `User's email`, example: 'example@gmail.com' })
  email!: string;

  @AutoMap()
  @Expose({ name: 'email_verified', groups: [Group.ADMIN] })
  @ApiProperty({ name: 'email_verified', description: `Flag that indicates if email is verified`, example: true })
  emailVerified!: boolean;

  @AutoMap()
  @Expose({ name: 'photo_url', groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({
    name: 'photo_url',
    description: `User photo url`,
    example: 'https://avatars1.githubusercontent.com/u/32201854?s=460&u=320c9cb753c019fa0643486ea01e2abe3ed52eb0&v=4',
  })
  photoURL!: string;

  @AutoMap()
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Whether or not the user is disabled`, example: false })
  disabled!: boolean;

  @AutoMap()
  @Expose({ name: 'dark_theme', groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({ name: 'dark_theme', description: `User's theme`, example: true })
  darkTheme!: boolean;

  @AutoMap(() => String)
  @Expose({ groups: [Group.ADMIN, Group.STUDENT] })
  @ApiProperty({ description: `User's type`, example: UserType.PROFESSORSHIP })
  type!: UserType;

  constructor(partial: Partial<ResponseUserDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
