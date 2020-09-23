import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { CareerCourseRelation } from './career-course-relation.entity';

@Entity('relations')
@Unique(['name'])
export class Relation extends BaseEntity {
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.relation)
  careerCourseRelations!: CareerCourseRelation[];

  constructor(partial: Partial<Relation>) {
    super(partial);
    Object.assign(this, partial);
  }
}
