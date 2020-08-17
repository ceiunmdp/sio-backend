import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Entity, JoinTable, ManyToMany, TableInheritance } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Role } from './role.entity';

@Entity('users')
@TableInheritance({ column: { type: 'enum', enum: UserType, name: 'type' } })
export class User extends BaseEntity {
  @AutoMap(() => Role)
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
  roles!: Promise<Role[]>;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
