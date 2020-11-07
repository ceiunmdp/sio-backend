import { AutoMap } from 'nestjsx-automapper';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderState } from './order-state.entity';
import { Order } from './order.entity';

@Entity('orders_to_order_states')
export class OrderToOrderState {
  @AutoMap(() => Order)
  @ManyToOne(() => Order, (order) => order.orderToOrderStates, { primary: true, nullable: false })
  @JoinColumn({ name: 'order_id' })
  readonly order!: Order;

  @AutoMap(() => OrderState)
  @ManyToOne(() => OrderState, { primary: true, nullable: false, eager: true })
  @JoinColumn({ name: 'order_state_id' })
  readonly state!: OrderState;

  @Column({ update: false })
  readonly timestamp!: Date;

  constructor(partial: Partial<OrderToOrderState>) {
    Object.assign(this, partial);
  }
}
