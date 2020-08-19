import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { AutoMap } from 'nestjsx-automapper';

@Entity('registration_tokens')
export class RegistrationToken {
  @AutoMap(() => User)
  @OneToOne(() => User, { primary: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  readonly user!: Promise<User>;

  @Column({ update: false })
  readonly token!: string;
}
