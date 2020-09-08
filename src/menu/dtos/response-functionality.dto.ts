import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_ROLES } from 'src/common/constants/all-roles';
import { ResponseFunctionalityCircularDto } from './response-functionality-circular.dto';

@Exclude()
export class ResponseFunctionalityDto extends ResponseBaseEntity {
  @Expose({ groups: ALL_ROLES })
  @ApiProperty({ description: 'Name of functionality', example: 'Movements' })
  name!: string;

  @Expose({ name: 'sub_functionalities', groups: ALL_ROLES })
  @AutoMap(() => ResponseFunctionalityCircularDto)
  @ApiProperty({
    name: 'sub_functionalities',
    description: 'List of subFunctionalities',
    type: () => [ResponseFunctionalityCircularDto],
  })
  subFunctionalities!: ResponseFunctionalityCircularDto[];

  constructor(partial: Partial<ResponseFunctionalityDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
