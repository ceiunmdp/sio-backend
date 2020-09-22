import { ApiProperty } from '@nestjs/swagger';
import * as bytes from 'bytes';
import { Allow, IsMimeType, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { UpdateFileDto } from './update-file.dto';

export class CreateFileDto extends UpdateFileDto {
  @IsMimeType()
  @ApiProperty({ description: `File's mimetype`, example: 'application/pdf' })
  mimetype!: string;

  @IsPositive()
  @ApiProperty({ description: `File's number of sheets`, example: 53 })
  numberOfSheets!: number;

  @IsPositive()
  @ApiProperty({ description: `File's size`, example: bytes('14.6MB') })
  size!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `File's path`,
    example: './files/4bd4c8c4-1935-4e3a-8f89-fcb85a94a0c8/filename-date.pdf',
  })
  path!: string;

  @Allow()
  @ApiProperty({ description: `File's owner` })
  ownerId!: string;

  @Allow() //* Already verified in MulterConfigService
  @ApiProperty({ description: `Course file belongs to` })
  courseId!: string;

  constructor(partial: Partial<CreateFileDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
