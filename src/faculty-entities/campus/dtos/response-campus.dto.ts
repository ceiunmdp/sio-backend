import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';

@Exclude()
export class ResponseCampusDto extends ResponseBaseEntity {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: `Campus's name`, example: 'Central' })
  name!: string;

  constructor(partial: Partial<ResponseCampusDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
