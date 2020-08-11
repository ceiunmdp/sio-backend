import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { Entity, JoinTable, ManyToMany, TableInheritance } from 'typeorm';
import { UserType } from '../enums/user-type';
import { Role } from './role.entity';

@Entity('users')
@TableInheritance({ column: { type: 'enum', enum: UserType, name: 'type' } })
export class User extends BaseEntity {
  // @PrimaryGeneratedColumn()
  // id!: string;

  @AutoMap(() => Role)
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
  roles!: Promise<Role[]>;
}
