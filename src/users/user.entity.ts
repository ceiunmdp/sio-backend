import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  username: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // @Exclude()
  @Column('text')
  password: string;

  // @ManyToOne(
  //     type => User,
  //     user => user.role,
  // )
  // role: Role;

  // @Column({ type: 'enum', enum: UserRole })
  // role: UserRole;
}
