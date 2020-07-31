import { Career } from 'src/faculty-entities/careers/entities/career.entity';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Relation } from './relation.entity';

@Entity('careers_courses_relations')
export class CareerCourseRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Career, (career) => career.careerCourseRelations, { nullable: false })
  career: Career;

  @ManyToOne(() => Course, (course) => course.careerCourseRelations, { nullable: false })
  course: Course;

  @ManyToOne(() => Relation, (relation) => relation.careerCourseRelations, { nullable: false })
  relation: Relation;
}
