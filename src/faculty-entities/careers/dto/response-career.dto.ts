import { Expose, Exclude } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role';
import { Career } from '../entities/career.entity';

@Exclude()
export class ResponseCareerDto {
  @Expose()
  id: string;

  @Expose({ groups: [UserRole.ADMIN] })
  name: string;

  constructor(partial: Partial<Career>) {
    Object.assign(this, partial);
  }
}
