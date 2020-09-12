import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { EMovementType } from '../enums/e-movement-type.enum';

export class ResponseMovementTypeDto extends ResponseBaseEntity {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Movement type's name`, example: 'Top Up' })
  name!: string;

  @AutoMap(() => String)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Movement type's code`, example: EMovementType.TOP_UP })
  code!: EMovementType;

  constructor(partial: Partial<ResponseMovementTypeDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
