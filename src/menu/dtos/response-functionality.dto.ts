import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { EFunctionality } from '../enums/e-functionality.enum';
import { ResponseFunctionalityCircularDto } from './response-functionality-circular.dto';

@Exclude()
export class ResponseFunctionalityDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Functionality's name`, example: 'Movements' })
  name!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Functionality's code`, example: EFunctionality.MY_ORDERS })
  code!: EFunctionality;

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
