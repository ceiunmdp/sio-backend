import { ApiProperty } from '@nestjs/swagger';
import bytes from 'bytes';
import { IsInt, Max, Min } from 'class-validator';
import { UpdateUserDto } from 'src/users/users/dtos/update-user.dto';

export class UpdateProfessorshipDto extends UpdateUserDto {
  @IsInt()
  @Min(bytes('200MB'))
  @Max(bytes('2GB'))
  @ApiProperty({
    name: 'available_storage',
    description: `Professorships's available storage [bytes]`,
    example: 1069180589,
  })
  availableStorage!: number;
}
