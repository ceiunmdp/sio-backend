import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';

@Exclude()
export class ResponseConfigurationDto extends ResponseBaseEntityDto {
  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Configuration's colour flag`, example: false })
  colour!: boolean;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ name: 'double_sided', description: `Configuration's double sided flag`, example: true })
  doubleSided!: boolean;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ description: `Range of pages to print`, example: '1-3,8-11,9-15' })
  range!: string;

  @Expose({ groups: [Group.ADMIN, Group.CAMPUS, Group.STUDENT, Group.SCHOLARSHIP] })
  @ApiProperty({ name: 'slides_per_sheet', description: `Slides per sheet`, example: 4 })
  slidesPerSheet!: number;

  constructor(partial: Partial<ResponseConfigurationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
