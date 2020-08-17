import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { Column, Entity, OneToMany, Index } from 'typeorm';
import { CareerCourseRelation } from './career-course-relation.entity';

@Entity('relations')
export class Relation extends BaseEntity {
  @Index('name-idx', { unique: true })
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.relation)
  careerCourseRelations!: Promise<CareerCourseRelation[]>;

  constructor(partial: Partial<Relation>) {
    super();
    Object.assign(this, partial);
  }
}
