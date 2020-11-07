import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';

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

  constructor(partial: Partial<ResponseBindingGroupDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
