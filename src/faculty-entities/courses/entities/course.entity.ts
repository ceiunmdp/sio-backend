import { AutoMap } from 'nestjsx-automapper';
import { BaseEntity } from 'src/common/base-classes/base-entity.entity';
import { CareerCourseRelation } from 'src/faculty-entities/relations/entities/career-course-relation.entity';
import { Professorship } from 'src/users/professorships/entities/professorship.entity';
import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm';

@Entity('courses')
@Unique(['name'])
export class Course extends BaseEntity {
  @Column()
  name!: string;

  @AutoMap(() => CareerCourseRelation)
  @OneToMany(() => CareerCourseRelation, (careerCourseRelation) => careerCourseRelation.course)
  careerCourseRelations!: CareerCourseRelation[];

  @AutoMap(() => Professorship)
  @OneToOne(() => Professorship, (professorship) => professorship.course)
  readonly professorship!: Professorship;

  constructor(partial: Partial<Course>) {
    super(partial);
    Object.assign(this, partial);
  }
}
