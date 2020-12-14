import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { EFileState } from 'src/orders/order-files/enums/e-file-state.enum';

@Exclude()
export class ResponseFileStateDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order file state's name`, example: 'Printing' })
  name!: string;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, ...Group.STUDENT] })
  @ApiProperty({ description: `Order file state's code`, example: EFileState.PRINTING })
  code!: EFileState;

  constructor(partial: Partial<ResponseFileStateDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
