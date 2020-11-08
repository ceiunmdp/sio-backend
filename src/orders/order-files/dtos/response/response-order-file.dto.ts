import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ResponseFileDto } from 'src/files/dtos/response-file.dto';
import { ResponseBindingGroupDto } from './response-binding-group.dto';
import { ResponseConfigurationDto } from './response-configuration.dto';
import { ResponseFileStateDto } from './response-file-state.dto';

@Exclude()
export class ResponseOrderFileDto extends ResponseBaseEntityDto {
  @AutoMap(() => ResponseFileDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: 'File' })
  file!: ResponseFileDto;

  @AutoMap(() => ResponseFileStateDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order file's state` })
  state!: ResponseFileStateDto;

  @AutoMap(() => ResponseConfigurationDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order file's configuration` })
  configuration!: ResponseConfigurationDto;

  @AutoMap(() => ResponseBindingGroupDto)
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ name: 'binding_group', description: `Order file's binding group` })
  bindingGroup?: ResponseBindingGroupDto;

  // TODO
  //? Should 'position' be here or inside 'bindingGroup' object?
  // position?: number

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Order file's price`, example: 7.5 })
  total!: number;

  constructor(partial: Partial<ResponseOrderFileDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}