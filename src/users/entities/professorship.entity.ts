import { AutoMap } from 'nestjsx-automapper';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@ChildEntity()
export class Professorship extends User {
  @AutoMap(() => Course)
  @ManyToOne(() => Course, (course) => course.professorships)
  @JoinColumn({ name: 'course_id' })
  course!: Promise<Course>;
}
