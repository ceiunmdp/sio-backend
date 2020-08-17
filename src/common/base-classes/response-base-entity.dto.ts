import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { UserRole } from '../enums/user-role.enum';

export class ResponseBaseEntity {
  @AutoMap()
  @Expose({ groups: [UserRole.ADMIN, UserRole.CAMPUS, UserRole.PROFESSORSHIP, UserRole.SCHOLARSHIP, UserRole.STUDENT] })
  @ApiProperty({ description: 'UUID' })
  id!: string;
}
