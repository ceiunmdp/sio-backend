import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
import { UpdateUserDto } from 'src/users/users/dtos/update-user.dto';

export class UpdateProfessorshipDto extends UpdateUserDto {
  @IsPositive()
  @ApiProperty({
    name: 'available_storage',
    description: `Professorships's available storage [bytes]`,
    example: 1073741824,
  })
  availableStorage!: number;
}
