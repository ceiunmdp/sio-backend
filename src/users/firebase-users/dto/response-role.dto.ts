import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Exclude()
export class ResponseRoleDto extends ResponseBaseEntity {
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Name of role' })
  name!: string;

  constructor(partial: Partial<ResponseRoleDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
