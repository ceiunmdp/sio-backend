import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @IsBoolean()
  @ApiProperty({ description: `Notification's flag to know if it has been read`, example: true })
  read!: boolean;
}
