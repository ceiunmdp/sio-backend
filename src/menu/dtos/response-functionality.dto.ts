import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntity } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { ResponseFunctionalityCircularDto } from './response-functionality-circular.dto';

@Exclude()
export class ResponseFunctionalityDto extends ResponseBaseEntity {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: 'Name of functionality', example: 'Movements' })
  name!: string;

  @AutoMap(() => ResponseFunctionalityCircularDto)
  @Expose({ name: 'sub_functionalities', groups: ALL_GROUPS })
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
