import { ApiProperty } from '@nestjs/swagger';
import * as bytes from 'bytes';
import { IsNumber, Max, Min } from 'class-validator';
import { UpdateUserDto } from 'src/users/users/dto/update-user.dto';

export class UpdateProfessorshipDto extends UpdateUserDto {
  @IsNumber()
  @Min(bytes('200MB'))
  @Max(bytes('2GB'))
  @ApiProperty({
    name: 'available_storage',
    description: `Professorships's available storage [bytes]`,
    example: 1069180589,
  })
  availableStorage!: number;
}
