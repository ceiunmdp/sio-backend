import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { File } from 'src/files/entities/file.entity';
import { Order } from 'src/orders/orders/entities/order.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { BindingGroup } from '../../binding-groups/entities/binding-group.entity';
import { OrderFileFsm } from '../classes/order-file-fsm.class';
import { Configuration } from './configuration.entity';
import { FileState } from './file-state.entity';

@Entity('order_files')
export class OrderFile extends BaseEntity {
  @RelationId((orderFile: OrderFile) => orderFile.order)
  readonly orderId!: string;

  @AutoMap(() => Order)
  @ManyToOne(() => Order, (order) => order.orderFiles, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  readonly order!: Order;

  @RelationId((orderFile: OrderFile) => orderFile.file)
  readonly fileId!: string;

  @AutoMap(() => File)
  @ManyToOne(() => File, { nullable: false })
  @JoinColumn({ name: 'file_id' })
  readonly file!: File;

  //* Finite State Machine
  @AutoMap(() => OrderFileFsm)
  fsm!: OrderFileFsm;

  @AutoMap(() => FileState)
  @ManyToOne(() => FileState, { nullable: false, eager: true })
  @JoinColumn({ name: 'file_state_id' })
  state!: FileState;

  @AutoMap(() => Configuration)
  @ManyToOne(() => Configuration, { nullable: false })
  @JoinColumn({ name: 'configuration_id' })
  readonly configuration!: Configuration;

  @AutoMap(() => BindingGroup)
  @ManyToOne(() => BindingGroup) //* Could be null in case file doesn't belong to any binding group
  @JoinColumn({ name: 'binding_group_id' })
  readonly bindingGroup?: BindingGroup;

  @Column({ update: false, nullable: true })
  readonly position?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, update: false })
  readonly total!: number;

  constructor(partial: Partial<OrderFile>) {
    super(partial);
    Object.assign(this, partial);
  }

  @AfterLoad()
  getFsm() {
    this.fsm = new OrderFileFsm(this.state.code);
  }
}
