import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';

@Entity('order_states')
@Unique(['name'])
export class OrderState extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  constructor(partial: Partial<OrderState>) {
    super();
    Object.assign(this, partial);
  }
}
