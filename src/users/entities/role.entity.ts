import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { Functionality } from 'src/menu/entities/functionality.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column()
  name!: string;

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
