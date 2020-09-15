import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('registration_tokens')
export class RegistrationToken extends BaseEntity {
  @AutoMap(() => User)
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @Column()
  token!: string;
}
