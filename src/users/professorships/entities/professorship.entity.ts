import { AutoMap } from 'nestjsx-automapper';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { ChildEntity, Column, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../firebase-users/entities/user.entity';

@ChildEntity()
export class Professorship extends User {
  @Column({ name: 'available_size', type: 'bigint' })
  availableSize!: number; //* Bytes

  @Column({ name: 'remaining_size', type: 'bigint' })
  remainingSize!: number; //* Bytes

  @AutoMap(() => Course)
  @OneToOne(() => Course, (course) => course.professorship) //* Could be null for the other child entities
  @JoinColumn({ name: 'course_id' })
  readonly course!: Course;

  constructor(partial: Partial<Professorship>) {
    super(partial);
    Object.assign(this, partial);
  }
}
