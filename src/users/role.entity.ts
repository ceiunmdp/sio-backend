import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    type => Role,
    role => role.users
  )
  users: User[];
}
