import { ApiProperty } from '@nestjs/swagger';
import { IsEntityExist } from 'src/common/decorators/is-entity-exist.decorator';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { CreateUserDto } from 'src/users/users/dtos/create-user.dto';

export class CreateCampusUserDto extends CreateUserDto {
  @IsEntityExist(Campus)
  @ApiProperty({
    name: 'campus_id',
    description: `Campus's UUID related to user`,
    example: 'be279206-4fef-458a-bc11-4caded8cbc3e',
  })
  campusId!: string;
}
