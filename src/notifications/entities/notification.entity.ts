import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { User } from 'src/users/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationType } from './notification-type.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ name: 'message_id', update: false })
  readonly messageId!: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  readonly user!: User;

  @AutoMap(() => NotificationType)
  @ManyToOne(() => NotificationType, { nullable: false })
  @JoinColumn({ name: 'notification_type_id' })
  readonly type!: NotificationType;

  @Column({ update: false })
  readonly title!: string;

  @Column({ update: false, nullable: true })
  readonly body?: string; // TODO: Define if it's optional or required

  @Column({ name: 'image_url', update: false, nullable: true })
  readonly imageUrl?: string; // TODO: Define if it's optional or required

  @Column({ update: false, nullable: true })
  readonly data?: string; //* Could be an embedded entity

  //? Add index?
  @Index()
  @Column({ default: false })
  read!: boolean;

  constructor(partial: Partial<Notification>) {
    super(partial);
    Object.assign(this, partial);
  }
}
