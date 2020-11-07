import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsString, Validate } from 'class-validator';
import { MultiIntegerRange } from 'src/common/validators/classes/multi-integer-range.validator';

export class CreateConfigurationDto {
  @IsBoolean()
  @ApiProperty({ description: `Flag to indicate that file will be printed on colour`, example: true })
  colour!: boolean;

  @IsBoolean()
  @ApiProperty({
    name: 'double_sided',
    description: `Flag to indicate if file must be printed on double side`,
    example: false,
  })
  doubleSided!: boolean;

  @IsString()
  @Validate(MultiIntegerRange)
  @ApiProperty({ description: `Range of pages to print`, example: '1-3,8-11,9-15' })
  range!: string;

  @ApiHideProperty()
  //* Calculated number of sheets based on configuration
  numberOfSheets!: number;

  @IsIn([1, 2, 4, 6])
  @ApiProperty({ name: 'slides_per_sheet', description: `Slides per sheet`, example: 2 })
  slidesPerSheet!: number;
}
