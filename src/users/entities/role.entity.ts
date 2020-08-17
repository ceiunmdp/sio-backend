import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Functionality } from 'src/menu/entities/functionality.entity';
import { Column, Entity, ManyToMany, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column({ update: false })
  readonly name!: string;

  @AutoMap(() => User)
  @ManyToMany(() => User, (user) => user.roles)
  users!: Promise<User[]>;

  @AutoMap(() => Functionality)
  @ManyToMany(() => Functionality, (functionality) => functionality.roles)
  functionalities!: Promise<Functionality[]>;

  constructor(partial: Partial<Role>) {
    super();
    Object.assign(this, partial);
  }
}
