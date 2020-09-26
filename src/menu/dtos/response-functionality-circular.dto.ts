import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';
import { ResponseBaseEntityDto } from 'src/common/base-classes/response-base-entity.dto';
import { ALL_GROUPS } from 'src/common/constants/all-groups';
import { EFunctionality } from '../enums/e-functionality.enum';
import { ResponseFunctionalityDto } from './response-functionality.dto';

@Exclude()
export class ResponseFunctionalityCircularDto extends ResponseBaseEntityDto {
  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Functionality's name`, example: 'My orders' })
  name!: string;

  @Expose({ groups: ALL_GROUPS })
  @ApiProperty({ description: `Functionality's code`, example: EFunctionality.MY_ORDERS })
  code!: EFunctionality;

  @AutoMap(() => ResponseFunctionalityDto)
  @Expose({ name: 'sub_functionalities', groups: ALL_GROUPS })
  @ApiProperty({
    name: 'sub_functionalities',
    description: 'List of subFunctionalities',
    type: () => [ResponseFunctionalityDto],
  })
  subFunctionalities!: ResponseFunctionalityDto[];

  constructor(partial: Partial<ResponseFunctionalityCircularDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
