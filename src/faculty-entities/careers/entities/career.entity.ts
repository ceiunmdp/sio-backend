import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

@Entity('careers')
@Unique(['name'])
export class Career extends BaseEntity {
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.career)
  careerCourseRelations!: CareerCourseRelation[];

  constructor(partial: Partial<Career>) {
    super(partial);
    Object.assign(this, partial);
  }
}
