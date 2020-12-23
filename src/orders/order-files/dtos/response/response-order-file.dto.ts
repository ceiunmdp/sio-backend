import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ResponseFileDto } from 'src/files/dtos/response-file.dto';
import { ResponseOrderDto } from 'src/orders/orders/dtos/response/response-order.dto';
import { ResponseBindingGroupDto } from '../../../binding-groups/dtos/response-binding-group.dto';
import { ResponseConfigurationDto } from './response-configuration.dto';
import { ResponseFileStateDto } from './response-file-state.dto';

@Exclude()
export class ResponseOrderFileDto extends ResponseBaseEntityDto {
  @AutoMap(() => ResponseOrderDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: 'Order' })
  order!: ResponseOrderDto;

  @AutoMap(() => ResponseFileDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: 'File' })
  file!: ResponseFileDto;

  @AutoMap(() => ResponseFileStateDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order file's state` })
  state!: ResponseFileStateDto;

  @AutoMap(() => ResponseConfigurationDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order file's configuration` })
  configuration!: ResponseConfigurationDto;

  @AutoMap(() => ResponseBindingGroupDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ name: 'binding_group', description: `Order file's binding group` })
  bindingGroup?: ResponseBindingGroupDto;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order file's position inside binding group` })
  position?: number;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order file's price`, example: 7.5 })
  total!: number;

  constructor(partial: Partial<ResponseOrderFileDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
