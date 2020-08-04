import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from 'nestjsx-automapper';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.course)
  careerCourseRelations: CareerCourseRelation[];
}
