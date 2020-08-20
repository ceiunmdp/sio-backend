import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseUserDto } from './response-user.dto';

@Exclude()
export class ResponseProfessorshipDto extends ResponseUserDto {
  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Available size in bytes to store files' })
  availableSize!: number;

  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Remaining size in bytes to store files' })
  remainingSize!: number;

  constructor(partial: Partial<ResponseProfessorshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
