import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';
import { ENotificationType } from '../enums/e-notification-type.enum';

@Entity('notification_types')
@Unique(['name'])
@Unique(['code'])
export class NotificationType extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: ENotificationType, update: false })
  readonly code!: ENotificationType;

  @Column({ name: 'title_template', update: false })
  readonly titleTemplate!: string;

  @Column({ name: 'body_template', update: false })
  readonly bodyTemplate!: string; // TODO: Define if it's optional or required

  @Column({ name: 'image_url_template', update: false })
  readonly imageUrlTemplate!: string; // TODO: Define if it's optional or required

  @Column({ name: 'data_template', update: false })
  readonly dataTemplate!: string; //* Could be an embedded entity

  constructor(partial: Partial<NotificationType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
