import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ResponseUserDto } from '../../users/dto/response-user.dto';

@Exclude()
export class ResponseProfessorshipDto extends ResponseUserDto {
  @Expose({ name: 'available_storage', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'available_storage', description: 'Available storage [bytes]' })
  availableStorage!: number;

  @Expose({ name: 'storage_used', groups: [UserRole.ADMIN] })
  @ApiProperty({ name: 'storage_used', description: 'Storage already used [bytes]' })
  storageUsed!: number;

  constructor(partial: Partial<ResponseProfessorshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
