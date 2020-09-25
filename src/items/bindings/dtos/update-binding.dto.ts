import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class UpdateBindingDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `Binding's name`, example: 'Small binding' })
  name!: string;

  @IsPositive()
  @ApiProperty({ description: `Binding's price`, example: 15 })
  price!: number;

  @IsPositive()
  @ApiProperty({ name: 'sheets_limit', description: `Binding's sheets limit`, example: 100 })
  sheetsLimit!: number;
}
