import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { UpdateItemDto } from 'src/items/items/dtos/update-item.dto';

export class UpdateBindingDto extends UpdateItemDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Binding's name`, example: 'Small binding' })
  name!: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ name: 'sheets_limit', description: `Binding's sheets limit`, example: 100 })
  sheetsLimit!: number;
}
