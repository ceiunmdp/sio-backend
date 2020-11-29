import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { OrderFile } from 'src/orders/order-files/entities/order-file.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BindingGroupFsm } from '../classes/binding-group-fsm.class';
import { BindingGroupState } from './binding-group-state.entity';

@Entity('binding_groups')
export class BindingGroup extends BaseEntity {
  @Column({ update: false })
  readonly name!: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, update: false })
  readonly price!: number;

  // TODO
  //? Should sheets limit be denormalized?
  // @Column({ name: 'sheets_limit', update: false })
  // readonly sheetsLimit!: number;

  //* Finite State Machine
  @AutoMap(() => BindingGroupFsm)
  fsm!: BindingGroupFsm;

  @AutoMap(() => BindingGroupState)
  @ManyToOne(() => BindingGroupState, { nullable: false, eager: true })
  @JoinColumn({ name: 'binding_group_state_id' })
  state!: BindingGroupState;

  @AutoMap(() => OrderFile)
  @OneToMany(() => OrderFile, (orderFile) => orderFile.bindingGroup)
  orderFile!: OrderFile;

  constructor(partial: Partial<BindingGroup>) {
    super(partial);
    Object.assign(this, partial);
  }

  @AfterLoad()
  getFsm() {
    this.fsm = new BindingGroupFsm(this.state.code);
  }
}
