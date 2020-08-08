import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AutoMap } from 'nestjsx-automapper';

@Exclude()
export class ResponseFunctionalityDto {
  @Expose()
  @ApiProperty({ description: 'UUID of functionality' })
  id!: string;

  @Expose()
  @ApiProperty({ description: 'Name of functionality' })
  name!: string;

  @Expose()
  @AutoMap(() => ResponseFunctionalityDto)
  @ApiProperty({ description: 'List of subFunctionalities', type: () => ResponseFunctionalityDto })
  subFunctionalities?: ResponseFunctionalityDto[];

  constructor(partial: Partial<ResponseFunctionalityDto>) {
    Object.assign(this, partial);
  }
}
