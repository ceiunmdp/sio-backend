import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { PDFDocument } from 'pdf-lib';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { File } from 'src/files/entities/file.entity';
import { CreateBindingGroupDto } from '../../../binding-groups/dtos/create-binding-group.dto';
import { CreateConfigurationDto } from './create-configuration.dto';
import { CreateEncodedFileDto } from './create-encoded-file.dto';

export class CreateOrderFileDto {
  @IsOptional()
  @IsEntityExist(File)
  @ApiProperty({
    name: 'file_id',
    description: `File's UUID`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  fileId?: string;

  @AutoMap(() => File)
  @ApiHideProperty()
  file?: File;

  @IsOptional()
  @AutoMap(() => CreateEncodedFileDto)
  @ValidateNested()
  @Type(() => CreateEncodedFileDto)
  @ApiProperty({ description: `Encoded file` })
  encodedFile?: CreateEncodedFileDto;

  @AutoMap(() => PDFDocument)
  @ApiHideProperty()
  pdfDocument?: PDFDocument;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: `Number of copies with same configuration (binding groups do not apply here)`,
    example: 4,
  })
  copies!: number;

  @AutoMap(() => CreateConfigurationDto)
  @ValidateNested()
  @Type(() => CreateConfigurationDto)
  // TODO: See GitHub issue -> https://github.com/nestjs/swagger/issues/724
  // @ApiProperty({ description: `File's configuration`, type: CreateConfigurationDto })
  @ApiProperty({ type: CreateConfigurationDto })
  configuration!: CreateConfigurationDto;

  @AutoMap(() => CreateBindingGroupDto)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBindingGroupDto)
  @ApiProperty({
    name: 'binding_groups',
    description: `Binding groups of some or all copies of the file`,
    type: [CreateBindingGroupDto],
  })
  bindingGroups?: CreateBindingGroupDto[];

  @ApiHideProperty()
  total?: number;
}
