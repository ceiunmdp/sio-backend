import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ResponseOrderFileDto } from 'src/orders/order-files/dtos/response/response-order-file.dto';
import { ResponseBindingGroupStateDto } from './response-binding-group-state.dto';

@Exclude()
export class ResponseBindingGroupDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Binding group's name` })
  name!: string;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Binding group's price` })
  price!: number;

  //? Should sheets limit be denormalized?
  // sheetsLimit!: number

  @AutoMap(() => ResponseBindingGroupStateDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Binding Group's state` })
  state!: ResponseBindingGroupStateDto;

  @AutoMap(() => ResponseOrderFileDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: 'Order file' })
  orderFile!: ResponseOrderFileDto;

  constructor(partial: Partial<ResponseBindingGroupDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
