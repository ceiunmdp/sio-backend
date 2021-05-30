import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { AutoMap } from 'nestjsx-automapper';
import { UpdateFileStateDto } from './update-file-state.dto';

export class UpdateOrderFileDto {
  @IsUUID()
  @ApiProperty({
    name: 'printer_id',
    description: `Printer's UUID`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  printerId?: string;

  @AutoMap(() => UpdateFileStateDto)
  @ValidateNested()
  @Type(() => UpdateFileStateDto)
  @ApiProperty({ description: `Order file's state` })
  state!: UpdateFileStateDto;
}
