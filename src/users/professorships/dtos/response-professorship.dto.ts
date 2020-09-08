import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Group } from 'src/common/classes/group.class';
import { ResponseUserDto } from '../../users/dtos/response-user.dto';

@Exclude()
export class ResponseProfessorshipDto extends ResponseUserDto {
  @Expose({ name: 'available_storage', groups: [Group.ADMIN] })
  @ApiProperty({ name: 'available_storage', description: 'Available storage [bytes]', example: 1073741824 })
  availableStorage!: number;

  @Expose({ name: 'storage_used', groups: [Group.ADMIN] })
  @ApiProperty({ name: 'storage_used', description: 'Storage already used [bytes]', example: 75122 })
  storageUsed!: number;

  constructor(partial: Partial<ResponseProfessorshipDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
