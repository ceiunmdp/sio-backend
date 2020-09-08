import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { ItemType } from '../enums/item-type.enum';

@Exclude()
export class ResponseItemDto extends ResponseBaseEntity {
  @Expose({ groups: [Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Item's name`, example: 'Double sided' })
  name!: string;

  @Expose({ groups: [Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Item's price`, example: 2.5 })
  price!: number;

  @Expose({ groups: [Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Item's type`, example: ItemType.ITEM })
  type!: ItemType;

  constructor(partial: Partial<ResponseItemDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
