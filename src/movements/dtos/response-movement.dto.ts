import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ResponseUserDto } from 'src/users/users/dtos/response-user.dto';
import { ResponseMovementTypeDto } from './response-movement-type.dto';

export class ResponseMovementDto extends ResponseBaseEntity {
  @AutoMap(() => ResponseUserDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: 'Source user', example: 'Structure depends on role' })
  source!: ResponseUserDto;

  @AutoMap(() => ResponseUserDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Target user`, example: 'Structure depends on role' })
  target!: ResponseUserDto;

  @AutoMap(() => ResponseMovementTypeDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Movement's type` })
  type!: ResponseMovementTypeDto;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Movement's amount`, example: 20 })
  amount!: number;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Movement's date`, example: '2020-09-01T16:56:23.089Z' })
  date!: string;

  constructor(partial: Partial<ResponseMovementDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
