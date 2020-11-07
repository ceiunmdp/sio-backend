import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

export class CreateEncodedFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Temporary file's name`, example: 'Practice N° 1' })
  name!: string;

  @IsString()
  @IsBase64()
  @ApiProperty({
    description: `Base64 representation of temporary file`,
    example: 'ZXhhbXBsZQ==',
  })
  content!: string;
}
