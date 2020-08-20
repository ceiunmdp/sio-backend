import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseFunctionalityDto } from './response-functionality.dto';

@Exclude()
export class ResponseFunctionalityCircularDto extends ResponseBaseEntity {
  @Expose({ groups: UserRole.ALL.split(',') })
  @ApiProperty({ description: 'Name of functionality' })
  name!: string;

  @Expose({ groups: UserRole.ALL.split(',') })
  @AutoMap(() => ResponseFunctionalityDto)
  @ApiProperty({ description: 'List of subFunctionalities', type: () => [ResponseFunctionalityDto] })
  subFunctionalities!: ResponseFunctionalityDto[];

  constructor(partial: Partial<ResponseFunctionalityCircularDto>) {
    super();
    Object.assign(this, partial);
  }
}
