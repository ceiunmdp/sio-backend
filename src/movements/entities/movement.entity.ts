import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Student } from 'src/users/entities/student.entity';
import { MovementType } from './movement-type.entity';
import { AutoMap } from 'nestjsx-automapper';

@Entity('movements')
export class Movement extends BaseEntity {
  @AutoMap(() => Student)
  @ManyToOne(() => Student, (student) => student.movements, { nullable: false })
  @JoinColumn({ name: 'source_student_id' })
  readonly sourceStudent!: Promise<Student>;

  @AutoMap(() => Student)
  @ManyToOne(() => Student, (student) => student.movements, { nullable: false })
  @JoinColumn({ name: 'target_student_id' })
  readonly targetStudent!: Promise<Student>;

  @AutoMap(() => MovementType)
  @ManyToOne(() => MovementType, { nullable: false })
  @JoinColumn({ name: 'movement_type_id' })
  readonly type!: Promise<MovementType>;

  @Column({ type: 'decimal', precision: 6, scale: 2, update: false })
  readonly amount!: number;

  //* Timestamp is already stored in BaseEntity

  constructor(partial: Partial<Movement>) {
    super();
    Object.assign(this, partial);
  }
}
