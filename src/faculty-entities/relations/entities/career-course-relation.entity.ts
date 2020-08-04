import { Career } from 'src/faculty-entities/careers/entities/career.entity';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Relation } from './relation.entity';
import { AutoMap } from 'nestjsx-automapper';

@Entity('careers_courses_relations')
export class CareerCourseRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Career)
  @ManyToOne(() => Career, (career) => career.careerCourseRelations, { nullable: false })
  career: Career;

  @AutoMap(() => Course)
  @ManyToOne(() => Course, (course) => course.careerCourseRelations, { nullable: false })
  course: Course;

  @AutoMap(() => Relation)
  @ManyToOne(() => Relation, (relation) => relation.careerCourseRelations, { nullable: false })
  relation: Relation;

  constructor(partial: Partial<CareerCourseRelation>) {
    Object.assign(this, partial);
  }
}
