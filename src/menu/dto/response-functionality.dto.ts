import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseFunctionalityCircularDto } from './response-functionality-circular.dto';

@Exclude()
export class ResponseFunctionalityDto extends ResponseBaseEntity {
  @Expose({ groups: UserRole.ALL.split(',') })
  @ApiProperty({ description: 'Name of functionality' })
  name!: string;

  @Expose({ groups: UserRole.ALL.split(',') })
  @AutoMap(() => ResponseFunctionalityCircularDto)
  @ApiProperty({ description: 'List of subFunctionalities', type: () => [ResponseFunctionalityCircularDto] })
  subFunctionalities!: ResponseFunctionalityCircularDto[];

  constructor(partial: Partial<ResponseFunctionalityDto>) {
    super();
    Object.assign(this, partial);
  }
}
