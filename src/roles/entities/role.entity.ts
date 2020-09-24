import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Functionality } from 'src/menu/entities/functionality.entity';
import { Column, Entity, ManyToMany, Unique } from 'typeorm';
import { User } from '../../users/users/entities/user.entity';

@Entity('roles')
@Unique(['name'])
@Unique(['code'])
export class Role extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: UserRole, update: false })
  readonly code!: UserRole;

  @AutoMap(() => User)
  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @AutoMap(() => Functionality)
  @ManyToMany(() => Functionality, (functionality) => functionality.roles)
  functionalities!: Functionality[];

  constructor(partial: Partial<Role>) {
    super(partial);
    Object.assign(this, partial);
  }
}
