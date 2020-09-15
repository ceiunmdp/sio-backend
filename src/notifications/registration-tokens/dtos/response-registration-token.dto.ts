import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';

export class ResponseRegistrationTokenDto extends ResponseBaseEntity {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Registration token` })
  token!: string;
}
