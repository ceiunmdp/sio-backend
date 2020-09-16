import { PartialType } from '@nestjs/swagger';
import { UpdateNotificationDto } from './update-notification.dto';

export class PartialUpdateNotificationDto extends PartialType(UpdateNotificationDto) {}
