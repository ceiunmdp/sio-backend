import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.course)
  careerCourseRelations: CareerCourseRelation[];
}
