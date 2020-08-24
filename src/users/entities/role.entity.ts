import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Functionality } from 'src/menu/entities/functionality.entity';
import { Column, Entity, ManyToMany, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
@Unique(['name'])
export class Role extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @AutoMap(() => User)
  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @AutoMap(() => Functionality)
  @ManyToMany(() => Functionality, (functionality) => functionality.roles)
  functionalities!: Functionality[];

  constructor(partial: Partial<Role>) {
    super();
    Object.assign(this, partial);
  }
}
