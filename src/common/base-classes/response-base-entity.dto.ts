import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ALL_ROLES } from '../constants/all-roles';
export class ResponseBaseEntity {
  @AutoMap()
  @Expose({ groups: ALL_ROLES })
  @ApiProperty({ description: 'UUID', example: '0de63cc8-d62d-4ea1-aa37-1846b6cf429d' })
  id!: string;

  constructor(partial: Partial<ResponseBaseEntity>) {
    Object.assign(this, partial);
  }
}
