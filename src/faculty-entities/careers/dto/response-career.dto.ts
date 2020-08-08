import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role';
import { Career } from '../entities/career.entity';

@Exclude()
export class ResponseCareerDto {
  @Expose()
  @ApiProperty({ description: 'UUID of career' })
  id!: string;

  @Expose({ groups: [UserRole.ADMIN] })
  @ApiProperty({ description: 'Name of career' })
  name!: string;

  constructor(partial: Partial<Career>) {
    Object.assign(this, partial);
  }
}
