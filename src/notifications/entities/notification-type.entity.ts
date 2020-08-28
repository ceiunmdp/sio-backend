import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('notification_types')
@Unique(['name'])
export class NotificationType extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ name: 'title_template', update: false })
  readonly titleTemplate!: string;

  @Column({ name: 'body_template', update: false })
  readonly bodyTemplate!: string;

  @Column({ name: 'image_url_template', update: false })
  readonly imageUrlTemplate!: string;

  @Column({ name: 'data_template', update: false })
  readonly dataTemplate!: string; //* Could be an embedded entity

  constructor(partial: Partial<NotificationType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
