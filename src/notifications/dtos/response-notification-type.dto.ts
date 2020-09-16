import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { ENotificationType } from '../enums/e-notification-type.enum';

@Exclude()
export class ResponseNotificationTypeDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification type's name`, example: 'Incoming transfer' })
  name!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Notification type's code`, example: ENotificationType.INCOMING_TRANSFER })
  code!: ENotificationType;

  constructor(partial: Partial<ResponseNotificationTypeDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
