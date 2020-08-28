import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Student } from 'src/users/students/entities/student.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { MovementType } from './movement-type.entity';

@Entity('movements')
export class Movement extends BaseEntity {
  @AutoMap(() => Student)
  @ManyToOne(() => Student, (student) => student.movements, { nullable: false })
  @JoinColumn({ name: 'source_student_id' })
  readonly sourceStudent!: Student;

  @AutoMap(() => Student)
  @ManyToOne(() => Student, (student) => student.movements, { nullable: false })
  @JoinColumn({ name: 'target_student_id' })
  readonly targetStudent!: Student;

  @AutoMap(() => MovementType)
  @ManyToOne(() => MovementType, { nullable: false })
  @JoinColumn({ name: 'movement_type_id' })
  readonly type!: MovementType;

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false })
  readonly amount!: number;

  //* Timestamp is already stored in BaseEntity

  constructor(partial: Partial<Movement>) {
    super(partial);
    Object.assign(this, partial);
  }
}
