import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';
import { ResponseItemDto } from 'src/items/items/dtos/response-item.dto';

@Exclude()
export class ResponseBindingDto extends ResponseItemDto {
  @Expose({ groups: [Group.ADMIN, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ name: 'sheets_limit', description: `Binding's sheets limit`, example: 100 })
  sheetsLimit!: number;

  constructor(partial: Partial<ResponseBindingDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
