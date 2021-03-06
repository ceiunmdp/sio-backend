import { ChildEntity } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ChildEntity()
export class Admin extends User {
  constructor(partial: Partial<Admin>) {
    super(partial);
    Object.assign(this, partial);
  }
}
