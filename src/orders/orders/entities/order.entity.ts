import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { OrderFile } from 'src/orders/order-files/entities/order-file.entity';
import { Student } from 'src/users/students/entities/student.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { TypeState } from 'typestate';
import { OrderFsmStaff } from '../classes/order-fsm-staff.class';
import { OrderFsmStudent } from '../classes/order-fsm-student.class';
import { EOrderState } from '../enums/e-order-state.enum';
import { OrderState } from './order-state.entity';
import { OrderToOrderState } from './order-to-order-state.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @RelationId((order: Order) => order.student)
  readonly studentId!: string;

  @AutoMap(() => Student)
  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  readonly student!: Student;

  @RelationId((order: Order) => order.campus)
  readonly campusId!: string;

  @AutoMap(() => Campus)
  @ManyToOne(() => Campus, { nullable: false })
  @JoinColumn({ name: 'campus_id' })
  readonly campus!: Campus;

  @AutoMap(() => OrderFile)
  @OneToMany(() => OrderFile, (orderFile) => orderFile.order, { cascade: true })
  readonly orderFiles!: OrderFile[];

  //* Finite State Machines
  @AutoMap(() => TypeState.FiniteStateMachine)
  fsmStaff!: TypeState.FiniteStateMachine<EOrderState>;
  @AutoMap(() => TypeState.FiniteStateMachine)
  fsmStudent!: TypeState.FiniteStateMachine<EOrderState>;

  @AutoMap(() => OrderState)
  @ManyToOne(() => OrderState, { nullable: false, eager: true })
  @JoinColumn({ name: 'state_id' })
  state!: OrderState;

  @AutoMap(() => OrderToOrderState)
  @OneToMany(() => OrderToOrderState, (orderToOrderState) => orderToOrderState.order, { cascade: true })
  orderToOrderStates!: OrderToOrderState[];

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false, nullable: true }) //* Could be null in case student pays total sum
  readonly deposit?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false })
  readonly total!: number;

  constructor(partial: Partial<Order>) {
    super(partial);
    Object.assign(this, partial);
  }

  @AfterLoad()
  getFiniteStateMachines() {
    this.fsmStaff = new OrderFsmStaff(this.state.code);
    this.fsmStudent = new OrderFsmStudent(this.state.code);
  }
}
