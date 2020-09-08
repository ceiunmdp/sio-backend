import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { Group } from 'src/common/classes/group.class';
import { UserRole } from 'src/common/enums/user-role.enum';

@Exclude()
export class ResponseRoleDto extends ResponseBaseEntity {
  @Expose({ groups: [Group.ADMIN] })
  @ApiProperty({ description: 'Name of role', example: UserRole.STUDENT })
  name!: string;

  constructor(partial: Partial<ResponseRoleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
