import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Campus } from 'src/faculty-entities/campus/entities/campus.entity';
import { Student } from 'src/users/students/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderFile } from './order-file.entity';
import { OrderToOrderState } from './order-to-order-state.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @AutoMap(() => Student)
  @ManyToOne(() => Student, { nullable: false })
  @JoinColumn({ name: 'student_id' })
  readonly student!: Student;

  @AutoMap(() => Campus)
  @ManyToOne(() => Campus, { nullable: false })
  @JoinColumn({ name: 'campus_id' })
  readonly campus!: Campus;

  @AutoMap(() => OrderFile)
  @OneToMany(() => OrderFile, (orderFile) => orderFile.order)
  readonly orderFiles!: OrderFile[];

  @AutoMap(() => OrderToOrderState)
  @OneToMany(() => OrderToOrderState, (orderToOrderState) => orderToOrderState.order)
  orderToOrderStates!: OrderToOrderState[];

  // TODO: Define if the app should support this kind of payment
  // readonly deposit!: number

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false })
  readonly total!: number;

  constructor(partial: Partial<Order>) {
    super(partial);
    Object.assign(this, partial);
  }
}
