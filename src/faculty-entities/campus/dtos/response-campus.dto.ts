import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';

@Exclude()
export class ResponseCampusDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Campus's name`, example: 'Central' })
  name!: string;

  constructor(partial: Partial<ResponseCampusDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
