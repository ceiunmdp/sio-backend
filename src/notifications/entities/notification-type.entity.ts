import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('notification_types')
export class NotificationType extends BaseEntity {
  @Index('name-idx', { unique: true })
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
    super();
    Object.assign(this, partial);
  }
}
