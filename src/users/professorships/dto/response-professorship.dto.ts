import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseUserDto } from '../../firebase-users/dto/response-user.dto';

@Exclude()
export class ResponseProfessorshipDto extends ResponseUserDto {
  @Expose({ name: 'available_size', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'available_size', description: 'Available size in bytes to store files' })
  availableSize!: number;

  @Expose({ name: 'remaining_size', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'remaining_size', description: 'Remaining size in bytes to store files' })
  remainingSize!: number;

  constructor(partial: Partial<ResponseProfessorshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
