import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { File } from 'src/files/entities/file.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BindingGroup } from './binding-group.entity';
import { Configuration } from './configuration.entity';
import { FileState } from './file-state.entity';
import { Order } from './order.entity';

@Entity('order_files')
export class OrderFile extends BaseEntity {
  @AutoMap(() => Order)
  @ManyToOne(() => Order, (order) => order.orderFiles, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  readonly order!: Order;

  @AutoMap(() => File)
  @ManyToOne(() => File, { nullable: false })
  @JoinColumn({ name: 'file_id' })
  readonly file!: File;

  @AutoMap(() => FileState)
  @ManyToOne(() => FileState, { nullable: false })
  @JoinColumn({ name: 'file_state_id' })
  state!: FileState;

  @AutoMap(() => Configuration)
  @ManyToOne(() => Configuration, { nullable: false })
  @JoinColumn({ name: 'configuration_id' })
  readonly configuration!: Configuration;

  @AutoMap(() => BindingGroup)
  @ManyToOne(() => BindingGroup) //* Could be null in case file doesn't belong to any binding group
  @JoinColumn({ name: 'binding_group_id' })
  readonly bindingGroup!: BindingGroup;

  @Column({ update: false })
  readonly position!: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false })
  readonly total!: number;

  constructor(partial: Partial<OrderFile>) {
    super();
    Object.assign(this, partial);
  }
}
