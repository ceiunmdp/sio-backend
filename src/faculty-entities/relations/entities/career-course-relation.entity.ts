import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Career } from 'src/faculty-entities/careers/entities/career.entity';
import { Course } from 'src/faculty-entities/courses/entities/course.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Relation } from './relation.entity';

@Entity('careers_courses_relations')
export class CareerCourseRelation extends BaseEntity {
  @AutoMap(() => Career)
  @ManyToOne(() => Career, (career) => career.careerCourseRelations, { nullable: false })
  @JoinColumn({ name: 'career_id' })
  career!: Career;

  @AutoMap(() => Course)
  @ManyToOne(() => Course, (course) => course.careerCourseRelations, { nullable: false })
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @AutoMap(() => Relation)
  @ManyToOne(() => Relation, (relation) => relation.careerCourseRelations, { nullable: false })
  @JoinColumn({ name: 'relation_id' })
  relation!: Relation;

  constructor(partial: Partial<CareerCourseRelation>) {
    super(partial);
    Object.assign(this, partial);
  }
}
