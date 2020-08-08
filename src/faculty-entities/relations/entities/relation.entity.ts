import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/classes/base-entity.class';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CareerCourseRelation } from './career-course-relation.entity';

@Entity('relations')
export class Relation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.relation)
  careerCourseRelations?: CareerCourseRelation[];

  constructor(partial: Partial<Relation>) {
    super();
    Object.assign(this, partial);
  }
}
