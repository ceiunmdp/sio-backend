import { ApiProperty } from '@nestjs/swagger';
import * as bytes from 'bytes';
import { IsNumber, Max, Min } from 'class-validator';
import { UpdateUserDto } from 'src/users/users/dto/update-user.dto';

export class UpdateProfessorshipDto extends UpdateUserDto {
  @IsNumber()
  @Min(bytes('200MB'))
  @Max(bytes('2GB'))
  @ApiProperty({ name: 'available_size', description: `Professorships's available size in bytes to store files` })
  availableSize!: number;
}
