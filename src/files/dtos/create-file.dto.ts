import { ApiProperty } from '@nestjs/swagger';
import bytes from 'bytes';
import { Allow, IsInt, IsMimeType, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { UpdateFileDto } from './update-file.dto';

export class CreateFileDto extends UpdateFileDto {
  @IsMimeType()
  @ApiProperty({ description: `File's mimetype`, example: 'application/pdf' })
  mimetype!: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ description: `File's number of sheets`, example: 53 })
  numberOfSheets!: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ description: `File's size`, example: bytes('14.6MB') })
  size!: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: `File's path`,
    example: '4bd4c8c4-1935-4e3a-8f89-fcb85a94a0c8/filename-date.pdf',
  })
  path!: string;

  @Allow()
  @ApiProperty({ description: `File's owner` })
  ownerId!: string;

  @Allow() //* Already verified in MulterConfigService
  @ApiProperty({
    description: `Courses's UUIDs file belongs to`,
    example: ['0de63cc8-d62d-4ea1-aa37-1846b6cf429d0', '911989ef-bb7c-4ca0-8cb3-bc2f976705a0'],
  })
  coursesIds!: string[];

  constructor(partial: Partial<CreateFileDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
