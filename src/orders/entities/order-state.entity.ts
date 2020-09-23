import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, Unique } from 'typeorm';
import { EOrderState } from '../enums/e-order-state.enum';

@Entity('order_states')
@Unique(['name'])
@Unique(['code'])
export class OrderState extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'enum', enum: EOrderState, update: false })
  readonly code!: EOrderState;

  constructor(partial: Partial<OrderState>) {
    super(partial);
    Object.assign(this, partial);
  }
}
