import { AutoMap } from 'nestjsx-automapper';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('registration_tokens')
export class RegistrationToken {
  @AutoMap(() => User)
  @OneToOne(() => User, { primary: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @Column({ update: false })
  readonly token!: string;
}
