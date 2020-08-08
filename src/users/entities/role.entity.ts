import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Functionality } from 'src/menu/entities/functionality.entity';
import { AutoMap } from 'nestjsx-automapper';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @AutoMap(() => User)
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @AutoMap(() => Functionality)
  @ManyToMany(() => Functionality, (functionality) => functionality.roles)
  functionalities: Functionality[];

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }
}
