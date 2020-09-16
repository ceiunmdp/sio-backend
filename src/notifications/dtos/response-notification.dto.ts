import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { ResponseNotificationTypeDto } from './response-notification-type.dto';

@Exclude()
export class ResponseNotificationDto extends ResponseBaseEntityDto {
  @AutoMap(() => ResponseUserDto)
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Notification's user` })
  user!: ResponseUserDto;

  @AutoMap(() => ResponseNotificationTypeDto)
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification's type` })
  type!: ResponseNotificationTypeDto;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification's title`, example: 'Title' })
  title!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification's body`, example: 'Body' })
  body!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification's image URL`, example: 'Image URL' })
  imageUrl!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification's data`, example: { key: 'value' } })
  data!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification's read flag`, example: false })
  read!: boolean;

  constructor(partial: Partial<ResponseNotificationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
