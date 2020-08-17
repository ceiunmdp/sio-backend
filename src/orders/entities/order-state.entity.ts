import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_states')
export class OrderState extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column({ update: false })
  readonly name!: string;

  constructor(partial: Partial<OrderState>) {
    super();
    Object.assign(this, partial);
  }
}
