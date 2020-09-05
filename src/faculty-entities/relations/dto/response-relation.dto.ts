import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';

@Exclude()
export class ResponseRelationDto extends ResponseBaseEntity {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: 'Name of relation', example: 'First year' })
  name!: string;

  constructor(partial: Partial<ResponseRelationDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}