import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CareerCourseRelation } from './career-course-relation.entity';

@Entity('relations')
export class Relation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, unique: true })
  name: string;

  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.relation)
  careerCourseRelations: CareerCourseRelation[];
}
