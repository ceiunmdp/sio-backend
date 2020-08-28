import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { UserRole } from '../enums/user-role.enum';

export class ResponseBaseEntity {
  @AutoMap()
  @Expose({ groups: UserRole.ALL.split(',') })
  @ApiProperty({ description: 'UUID' })
  id!: string;

  constructor(partial: Partial<ResponseBaseEntity>) {
    Object.assign(this, partial);
  }
}
