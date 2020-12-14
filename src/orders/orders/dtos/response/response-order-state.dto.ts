import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { EOrderState } from 'src/orders/orders/enums/e-order-state.enum';

@Exclude()
export class ResponseOrderStateDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order state's name`, example: 'Requested' })
  name!: string;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order state's code`, example: EOrderState.REQUESTED })
  code!: EOrderState;

  constructor(partial: Partial<ResponseOrderStateDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
