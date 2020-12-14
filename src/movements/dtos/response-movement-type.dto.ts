import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { EMovementType } from '../enums/e-movement-type.enum';

@Exclude()
export class ResponseMovementTypeDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Movement type's name`, example: 'Top Up' })
  name!: string;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Movement type's code`, example: EMovementType.TOP_UP })
  code!: EMovementType;

  constructor(partial: Partial<ResponseMovementTypeDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
