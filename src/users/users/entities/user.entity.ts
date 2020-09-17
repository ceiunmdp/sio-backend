import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Movement } from 'src/movements/entities/movement.entity';
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, TableInheritance } from 'typeorm';
import { UserType } from '../enums/user-type.enum';
import { Role } from './role.entity';

@Entity('users')
@TableInheritance({ column: { type: 'enum', enum: UserType, name: 'type' } })
export class User extends BaseEntity {
  @Index('IX_users_uid')
  @Column({ type: 'varchar', length: 36, default: null })
  uid!: string;

  // TODO: Consider adding an index here to speed up queries filtered by name
  @Column({ name: 'full_name' })
  displayName!: string;

  //* Firebase
  email!: string;

  //* Firebase
  emailVerified!: boolean;

  //* Firebase
  password!: string;

  //* Firebase
  photoURL!: string;

  //* Firebase
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
