import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index, JoinTable, ManyToMany, TableInheritance } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Role } from './role.entity';

@Entity('users')
@TableInheritance({ column: { type: 'enum', enum: UserType, name: 'type' } })
export class User extends BaseEntity {
  //* Firebase
  @AutoMap()
  @Index()
  @Column({ type: 'varchar', length: 36, default: null })
  uid!: string;

  //* Firebase
  @AutoMap()
  displayName!: string;

  //* Firebase
  @AutoMap()
  email!: string;

  //* Firebase
  @AutoMap()
  emailVerified!: boolean;

  //* Firebase
  password!: string;

  //* Firebase
  @AutoMap()
  photoURL!: string;

  //* Firebase
  @AutoMap()
  disabled!: boolean;

  //! Firebase (only in case of developing multi-tenant application)
  // readonly tenantId!: string | number

  @AutoMap()
  @Column({ name: 'dark_theme', default: false })
  darkTheme!: boolean;

  @AutoMap(() => String)
  @Column({ type: 'enum', enum: UserType, update: false })
  readonly type!: UserType;

  @AutoMap(() => Role)
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
  roles!: Role[];

  constructor(partial: Partial<User>) {
    super(partial);
    Object.assign(this, partial);
  }
}
