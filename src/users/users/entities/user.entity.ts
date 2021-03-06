import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Movement } from 'src/movements/entities/movement.entity';
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, TableInheritance } from 'typeorm';
import { Role } from '../../../roles/entities/role.entity';
import { UserType } from '../enums/user-type.enum';

@Entity('users')
@TableInheritance({ column: { type: 'enum', enum: UserType, name: 'type' } })
@Index('IX_users_uid', ['uid'])
@Index('IX_users_full_name', ['displayName'])
@Index('IX_users_email', ['email'])
@Index('IX_users_disabled', ['disabled'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 36, default: null }) //* Default value null, the tuple is first created and then reassigned this property with corresponding id
  uid!: string;

  @Column({ name: 'full_name', default: null }) //* Also in Firebase. Defaults to null in case the initial user does not have any display name associated with his account.
  displayName!: string;

  @Column() //* Also in Firebase
  email!: string;

  //* Firebase
  emailVerified!: boolean;

  //* Firebase
  password!: string;

  //* Firebase
  photoURL!: string;

  @Column({ default: false }) //* Also in Firebase
  disabled!: boolean;

  //! Firebase (only in case of developing multi-tenant application)
  // readonly tenantId!: string | number

  @Column({ name: 'dark_theme', default: false })
  darkTheme!: boolean;

  @Column({ type: 'enum', enum: UserType, update: false })
  readonly type!: UserType;

  @AutoMap(() => Role)
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'users_roles', joinColumn: { name: 'user_id' }, inverseJoinColumn: { name: 'role_id' } })
  roles!: Role[];

  @AutoMap(() => Movement)
  @OneToMany(() => Movement, (movement) => movement.source || movement.target)
  readonly movements!: Movement[];

  constructor(partial: Partial<User>) {
    super(partial);
    Object.assign(this, partial);
  }
}
