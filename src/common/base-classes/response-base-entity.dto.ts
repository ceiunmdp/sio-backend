import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ALL_GROUPS } from '../constants/all-groups.constant';

@Exclude()
export class ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: 'UUID', example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d' })
  id!: string;

  constructor(partial: Partial<ResponseBaseEntityDto>) {
    Object.assign(this, partial);
  }
}
