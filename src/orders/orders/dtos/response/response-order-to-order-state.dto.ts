import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { Group } from 'src/common/classes/group.class';
import { ResponseOrderStateDto } from './response-order-state.dto';

@Exclude()
export class ResponseOrderToOrderStateDto {
  @AutoMap(() => ResponseOrderStateDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order's state` })
  state!: ResponseOrderStateDto;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: 'State transition date', example: '2020-09-01T16:56:23.089Z' })
  timestamp!: string;

  constructor(partial: Partial<ResponseOrderToOrderStateDto>) {
    Object.assign(this, partial);
  }
}
